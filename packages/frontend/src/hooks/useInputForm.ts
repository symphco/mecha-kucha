import {useRouter} from 'next/router';
import {
  ChangeEventHandler,
  DragEventHandler,
  FormEventHandler,
  ReactEventHandler,
  useEffect,
  useState,
} from 'react';
import {
  AppState,
  SlotCollection,
  Slide,
  ImageSlotContent,
  ImageSourceKey, CaptionSourceKey,
} from '@symphco/mecha-kucha-common';
import {makeSlides, validateSlides} from '@/common';

interface UseInputFormParams {
  refresh?: (...args: unknown[]) => unknown;
}

export const useInputForm = (params = {} as UseInputFormParams) => {
  const router = useRouter();
  const [working, setWorking] = useState<string>();
  const [formKey, setFormKey] = useState<number>();
  const [slideImageLoading, setSlideImageLoading] = useState([] as number[]);
  const [appState, setAppState] = useState<AppState>({
    title: undefined,
    input: undefined,
    slides: undefined,
    imageGenerator: 'picsum',
    captionGenerator: 'airops',
    destination: 'googleSlides',
  });

  const [inputFormWorking, setInputFormWorking] = useState(false);
  const [isGoButtonDisabled, setIsGoButtonDisabled] = useState(true);
  const [isInspireMeButtonDisabled, setIsInspireMeButtonDisabled] = useState(true);

  const handlePresentationActionFormSubmit: FormEventHandler<HTMLElementTagNameMap['form']> = async (e) => {
    e.preventDefault();
    const valuesRaw = new FormData(e.currentTarget);
    const { submitter } = e.nativeEvent as unknown as { submitter: HTMLButtonElement };
    if (submitter.name === 'action') {
      if (submitter.value.startsWith('download:')) {
        const [, mediaType] = submitter.value.split(':');
        const data = {
          title: valuesRaw.get('title'),
          input: valuesRaw.get('input'),
          slides: valuesRaw
            .getAll('slides')
            .reduce(
              (theSlides, slideJson) => {
                if (typeof slideJson === 'string') {
                  return [
                    ...theSlides,
                    JSON.parse(slideJson),
                  ];
                }

                return theSlides;
              },
              [] as Slide[]
            ),
        }

        const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: mediaType.trim() }));
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `mechakucha-download-${Date.now()}.json`;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return;
      }
      if (submitter.value.startsWith('save')) {
        setWorking('export');
        const appStateStr = JSON.stringify(appState);
        const response = await fetch(
          '/api/presentations',
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: appStateStr,
          }
        );

        if (response.status === 401) {
          window.localStorage.setItem('mechakucha-last-state', appStateStr);
          setWorking(undefined);
          await router.push({
            pathname: '/api/auth/providers/google',
          });
          return;
        }

        setWorking(undefined);
        window.alert('Slides exported!');
      }
    }
  };



  const getSingleImage = async (slide: Slide, index: number) => {
    const r = await fetch(
      `/api/images/${slide.imageGenerator}/generate-single?index=${index}`,
      {
        method: 'POST',
        body: JSON.stringify(slide),
      },
    )
    if (!r.ok) {
      throw new Error('Error from Image Generator API.');
    }
    const rr = await r.json();
    return rr as ImageSlotContent;
  };

  const addSlideImages = async (slide: Partial<Slide>): Promise<Slide> => {
    const r = await fetch(
      `/api/images/${slide.imageGenerator}/generate`,
      {
        method: 'POST',
        body: JSON.stringify(slide),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
    if (!r.ok) {
      throw new Error('Error from Image Generator API.');
    }
    const rr = await r.json();
    return {
      ...slide,
      slots: rr
    } as Slide;
  };

  const addImages = async (slides: Partial<Slide>[]): Promise<Slide[]> => {
    const result = await Promise.allSettled(
      slides.map((slide) => addSlideImages(slide))
    );

    return result.map((r, i) => {
      if (r.status === 'fulfilled') {
        return r.value ?? slides[i] as Slide;
      }

      return slides[i] as Slide;
    });
  };

  const handleInputFormReset: FormEventHandler<HTMLElementTagNameMap['form']> = async (e) => {
    e.preventDefault();
    const { input: _, ...etcQuery } = router.query;
    await router.replace({
      query: etcQuery
    });
  };

  const handleInputFormSubmit: FormEventHandler<HTMLElementTagNameMap['form']> = async (e) => {
    e.preventDefault();
    setInputFormWorking(true);
    const valuesRaw = new FormData(e.currentTarget);
    const title = valuesRaw.get('title') as string ?? '';
    const imageGenerator = valuesRaw.get('imageGenerator') as ImageSourceKey ?? '';
    const captionGenerator = valuesRaw.get('captionGenerator') as CaptionSourceKey ?? '';
    const { submitter } = e.nativeEvent as unknown as { submitter: HTMLButtonElement };
    if (submitter.name === 'submit' && submitter.value === 'inspire-me') {
      const response = await fetch(
        '/api/contents/airops/generate',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
          }),
        }
      );
      const responseBody = await response.json();
      if (response.ok) {
        setFormKey(Date.now());
        setAppState((oldAppState) => ({
          ...oldAppState,
          title,
          imageGenerator,
          input: responseBody,
          slides: Array.isArray(oldAppState.slides) ? oldAppState.slides.map((s) => ({
            ...s,
            imageGenerator,
            captionGenerator,
          })) : oldAppState.slides,
        }));

      } else {
        window.alert(responseBody.message);
      }
      setInputFormWorking(false);
      return;
    }

    const input = valuesRaw.get('input') as string ?? '';
    if (input.trim().length < 1) {
      window.alert('Enter any input to generate slides!');
    }

    const values = {
      title,
      input,
      imageGenerator,
    };

    setSlideImageLoading([0, 1, 2, 3, 4]);
    let theSlides: Partial<Slide>[];
    try {
      theSlides = makeSlides(input, imageGenerator);
      const incompleteSlides = theSlides.filter((slide) => (
        typeof slide.title === 'undefined'
        || typeof slide.theme === 'undefined'
      ));

      if (incompleteSlides.length > 0) {
        window.alert('Incomplete slides');
        return;
      }
    } catch (errRaw) {
      const err = errRaw as Error;
      // TODO better error handling!
      window.alert(err.message as string);
      return;
    }

    const resultSlides = await addImages(theSlides);
    setAppState((oldAppState) => ({
      ...oldAppState,
      ...values,
      slides: resultSlides,
    }));

    const { input: _, ...etcQuery } = router.query;
    await router.replace({
      query: {
        ...etcQuery,
        slide: resultSlides[0].id,
      }
    });
    setInputFormWorking(false);
  };

  const handleUpdateCurrentSlide: ChangeEventHandler<
    HTMLElementTagNameMap['input']
    | HTMLElementTagNameMap['select']
    | HTMLElementTagNameMap['textarea']
  > = (e) => {
    if (typeof router.query.slide !== 'string') {
      return;
    }
    const slideId = router.query.slide;
    const name = e.currentTarget.name;
    const value = (
      e.currentTarget.tagName === 'INPUT' && e.currentTarget.type === 'number'
        ? (e.currentTarget as HTMLElementTagNameMap['input']).valueAsNumber
        : e.currentTarget.value
    );
    setAppState((oldAppState) => ({
      ...oldAppState,
      slides: oldAppState?.slides?.map((s) => (
        s.id === slideId
          ? {
            ...s,
            [name]: value
          }
          : s
      ))
    }));
  };

  const handleWindowDrop: DragEventHandler<HTMLElementTagNameMap['main']> = async (e) => {
    e.preventDefault();
    const [file] = Array.from(e.dataTransfer.files);
    if (typeof file === 'undefined') {
      return;
    }

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.addEventListener('error', (e) => {
        reject(e);
      })

      fileReader.addEventListener('load', async (e) => {
        const result = (e.currentTarget as FileReader).result as string;
        const newAppState = JSON.parse(result);
        setAppState(newAppState);
        const { input: _, ...etcQuery } = router.query;
        await router.replace({
          query: {
            ...etcQuery,
            slide: newAppState.slides[0].id,
          }
        });
        params?.refresh?.();
        resolve();
      });

      fileReader.readAsText(file);
    });
  };

  const handleSlideDataAction: FormEventHandler<HTMLElementTagNameMap['form']> = async (e) => {
    e.preventDefault();
    const valuesRaw = new FormData(e.currentTarget);
    const id = valuesRaw.get('id') as string ?? '';
    const { submitter } = e.nativeEvent as unknown as { submitter: HTMLButtonElement };
    if (submitter.name === 'action' && submitter.value === 'regenerate') {
      const thisSlide = appState.slides?.find((s) => s.id === id);
      if (typeof thisSlide === 'undefined') {
        return;
      }
      setSlideImageLoading([0, 1, 2, 3, 4]);
      const slideWithNewImages = await addSlideImages(thisSlide);
      setAppState((oldAppState) => ({
        ...oldAppState,
        slides: oldAppState.slides?.map((oldSlide) => (
          oldSlide.id === slideWithNewImages.id
            ? slideWithNewImages
            : oldSlide
        ))
      }));
    }
  };

  const handleCurrentSlideImageLoaded: ReactEventHandler<HTMLElementTagNameMap['img']> = (e) => {
    const parent = e.currentTarget.parentElement;
    if (parent === null) {
      return;
    }
    const grandparent = parent.parentElement;
    if (grandparent === null) {
      return;
    }
    const siblings = Array.from(grandparent.children);
    const thisIndex = siblings.findIndex((el) => el === parent);
    setSlideImageLoading((oldSlideImageLoading) => oldSlideImageLoading.filter((s) => s !== thisIndex));
  };

  const handleCurrentSlideImageRegenerate: FormEventHandler<HTMLElementTagNameMap['form']> = async (e) => {
    e.preventDefault();
    const currentSlide = appState.slides?.find((s) => s.id === router.query.slide);
    if (typeof currentSlide === 'undefined') {
      return;
    }
    const parent = e.currentTarget.parentElement;
    if (parent === null) {
      return;
    }
    const grandparent = parent.parentElement;
    if (grandparent === null) {
      return;
    }
    const siblings = Array.from(grandparent.children);
    const thisIndex = siblings.findIndex((el) => el === parent);

    const { submitter } = e.nativeEvent as unknown as { submitter: HTMLButtonElement };
    if (submitter.name === 'action') {
      switch (submitter.value) {
        case 'regenerate': {
          setSlideImageLoading((oldSlideImageLoading) => [
            ...oldSlideImageLoading,
            thisIndex
          ]);
          const image = await getSingleImage(currentSlide, thisIndex);
          const newSlide: Slide = {
            ...currentSlide,
            slots: [
              ...currentSlide.slots.slice(0, thisIndex),
              image,
              ...currentSlide.slots.slice(thisIndex)
            ] as SlotCollection,
          };
          setAppState((oldAppState) => ({
            ...oldAppState,
            slides: oldAppState.slides?.map((oldSlide) => (
              oldSlide.id === newSlide.id
                ? newSlide
                : oldSlide
            ))
          }));
          return;
        }
        default:
          break;
      }
    }
  };

  const handleValidate = (form: HTMLElementTagNameMap['form'] | null) => {
    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const values = Object.fromEntries(
      formData.entries()
    ) as Record<string, string>;
    const { title, input, imageGenerator } = values;
    const slides = makeSlides(input, imageGenerator);

    try {
      validateSlides(slides)
    } catch {
      setIsInspireMeButtonDisabled(title.trim().length < 1);
      setIsGoButtonDisabled(true);
      return;
    }

    setIsInspireMeButtonDisabled(title.trim().length < 1);
    setIsGoButtonDisabled(title.trim().length < 1);
  };

  useEffect(() => {
    if (
      (typeof appState.title === 'undefined' || typeof appState.input === 'undefined')
    ) {
      const lastStateStr = window.localStorage.getItem('mechakucha-last-state');
      let lastState = null;
      try {
        if (lastStateStr !== null) {
          lastState = JSON.parse(lastStateStr);
        }
      } catch {
        lastState = null;
      }
      if (lastState === null || typeof router.query.input !== 'string') {
        void router.replace({
          query: {
            input: 'true'
          }
        });
        return;
      }
      setAppState(lastState as AppState);
      window.localStorage.removeItem('mechakucha-last-state');
    }
  }, []);

  return {
    handlePresentationActionFormSubmit,
    handleInputFormReset,
    handleInputFormSubmit,
    handleUpdateCurrentSlide,
    handleWindowDrop,
    inputFormWorking,
    handleSlideDataAction,
    handleCurrentSlideImageLoaded,
    handleCurrentSlideImageRegenerate,
    slideImageLoading,
    appState,
    formKey,
    working,
    isGoButtonDisabled,
    isInspireMeButtonDisabled,
    handleValidate,
  };
};
