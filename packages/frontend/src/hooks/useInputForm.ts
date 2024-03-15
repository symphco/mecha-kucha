import {useRouter} from 'next/router';
import {ChangeEventHandler, FormEventHandler, useState} from 'react';
import {AppState, MAXIMUM_IMAGES, Slide, SLIDE_LAYOUTS} from '@/common';

export const useInputForm = () => {
  const router = useRouter();
  const [formKey, setFormKey] = useState<number>();
  const [appState, setAppState] = useState<AppState>({
    title: undefined,
    input: undefined,
    slides: undefined,
  });
  const [inputFormWorking, setInputFormWorking] = useState(false);

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
    const { submitter } = e.nativeEvent as unknown as { submitter: HTMLButtonElement };
    if (submitter.name === 'submit' && submitter.value === 'inspire-me') {
      const url = new URL(process.env.NEXT_PUBLIC_AIROPS_API_ENDPOINT as string, process.env.NEXT_PUBLIC_AIROPS_API_BASE_URL);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AIROPS_API_KEY as string}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: title,
        }),
      });
      const responseBody = await response.json();
      setFormKey(Date.now());
      setAppState((oldAppState) => ({
        ...oldAppState,
        title,
        input: responseBody.result.response,
      }));
      setInputFormWorking(false);
      return;
    }

    const input = valuesRaw.get('input') as string ?? '';
    const values = {
      title,
      input,
    };
    const lines = input.split('\n').filter((s) => s.trim().length > 0);
    const resultSlides = await lines.reduce(
      async (previousValuePromise, line) => {
        const previousSlides = await previousValuePromise;
        if (line.startsWith('Part ')) {
          const [, partTitle] = line.split(':');
          const title = partTitle.trim();

          return [
            ...previousSlides,
            {
              id: window.crypto.randomUUID(),
              imageUrls: [],
              layout: SLIDE_LAYOUTS[Math.floor(Math.random() * SLIDE_LAYOUTS.length)],
              text: '',
              visibleImages: Math.floor(Math.random() * (MAXIMUM_IMAGES + 1)),
              title,
              theme: '',
            } as Slide
          ];
        }

        if (line.startsWith('Theme:')) {
          const url = new URL(process.env.NEXT_PUBLIC_UNSPLASH_API_ENDPOINT as string, process.env.NEXT_PUBLIC_UNSPLASH_API_BASE_URL);
          const [, query] = line.split(':');
          const theme = query.trim();
          url.search = new URLSearchParams({
            page: '1',
            query: theme,
            client_id: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY as string,
          }).toString();
          const response = await fetch(url);
          const json = await response.json() as {
            results: {
              urls: {
                regular: string
              }
            }[]
          };
          const lastSlide = previousSlides.at(-1);
          if (typeof lastSlide === 'undefined') {
            return previousSlides;
          }
          return [
            ...previousSlides.slice(0, -1),
            {
              ...lastSlide,
              imageUrls: json.results.slice(0, MAXIMUM_IMAGES).map((s) => {
                return s.urls.regular;
              }),
              theme,
            }
          ] as Slide[];
        }

        const lastSlide = previousSlides.at(-1);
        if (typeof lastSlide === 'undefined') {
          return previousSlides;
        }
        return [
          ...previousSlides.slice(0, -1),
          {
            ...lastSlide,
            text: `${lastSlide.text}\n\n${line.trim()}`.trim()
          }
        ];
      },
      Promise.resolve<Slide[]>([])
    );

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
    const value = e.currentTarget.value;
    setAppState((oldAppState) => ({
      ...oldAppState,
      slides: oldAppState.slides?.map((s) => (
        s.id === slideId
          ? {
            ...s,
            [name]: value
          }
          : s
      ))
    }));
  };

  return {
    handleInputFormReset,
    handleInputFormSubmit,
    handleUpdateCurrentSlide,
    inputFormWorking,
    appState,
    formKey,
  };
};
