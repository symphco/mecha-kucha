import { NextPage } from 'next';
import {ChangeEventHandler, FC, FormEventHandler, Fragment, useState} from 'react';
import {ActionButton} from '@/components/molecules/ActionButton';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {AppState, MAXIMUM_IMAGES, Slide, SLIDE_LAYOUTS} from '@/common';
import {InputForm} from '@/components/organisms/InputForm';
import {SlideDataForm} from '@/components/organisms/SlideDataForm';

interface SlideDisplayProps {
  slide: Slide;
}

const SlideDisplay: FC<SlideDisplayProps> = ({
  slide
}) => {
  return (
    <>
      {slide.layout === 'vertical-bars' && Array.isArray(slide.imageUrls) && (
        <div className="flex h-full w-full">
          {slide.imageUrls.slice(0, slide.visibleImages).map((url, i) => (
            <div
              key={i}
              className="h-full w-0 flex-auto"
            >
              <img
                className="w-full h-full object-center object-cover"
                src={url}
              />
            </div>
          ))}
        </div>
      )}
      {slide.layout === 'horizontal-bars' && Array.isArray(slide.imageUrls) && (
        <div className="flex-col flex h-full w-full">
          {slide.imageUrls.slice(0, slide.visibleImages).map((url, i) => (
            <div
              key={i}
              className="h-0 w-full flex-auto"
            >
              <img
                className="w-full h-full object-center object-cover"
                src={url}
              />
            </div>
          ))}
        </div>
      )}
      {slide.layout === 'grid-left' && Array.isArray(slide.imageUrls) && (
        <div className="relative w-full h-full">
          <div className="grid grid-cols-2 absolute top-0 left-0 w-full h-full auto-rows-fr">
            {slide.imageUrls.slice(0, slide.visibleImages).map((url, i) => (
              <div
                key={i}
                className="only:col-span-2 [&:nth-child(4):not(:last-child)]:col-start-1 [&:nth-child(4):not(:last-child)]:row-start-4 [&:nth-child(4):not(:last-child)]:row-span-3 [&:nth-child(5)]:last:row-span-3 odd:last:row-span-4 row-span-2 odd:last:order-1 order-2 h-full"
              >
                <img
                  className="w-full h-full object-center object-cover"
                  src={url}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {slide.layout === 'grid-right' && Array.isArray(slide.imageUrls) && (
        <div className="relative w-full h-full">
          <div className="grid grid-cols-2 absolute top-0 left-0 w-full h-full auto-rows-fr">
            {slide.imageUrls.slice(0, slide.visibleImages).map((url, i) => (
              <div
                key={i}
                className="only:col-span-2 [&:nth-child(4):not(:last-child)]:col-start-2 [&:nth-child(4):not(:last-child)]:row-start-4 [&:nth-child(4):not(:last-child)]:row-span-3 [&:nth-child(5)]:last:col-start-2 [&:nth-child(5)]:last:row-start-1 [&:nth-child(5)]:last:row-span-3 odd:last:row-span-4 row-span-2 [&:not(:first-child)]odd:last:col-start-2 odd:last:row-start-1 odd:last:order-2 order-1 h-full"
              >
                <img
                  className="w-full h-full object-center object-cover"
                  src={url}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const IndexPage: NextPage = () => {
  const router = useRouter();
  const [inputFormWorking, setInputFormWorking] = useState(false);
  const [formKey, setFormKey] = useState<number>();
  const [appState, setAppState] = useState<AppState>({
    title: undefined,
    input: undefined,
    slides: undefined,
  });

  const currentSlide = appState.slides?.find((s) => s.id === router.query.slide);
  const showInputFormModal = typeof appState.title === 'undefined' || typeof appState.input === 'undefined' || typeof router.query.input === 'string';

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
      const url = new URL(process.env.NEXT_PUBLIC_AIROPS_API_ENDPOINT as string, 'https://api.airops.com');
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
          const url = new URL('/search/photos', 'https://api.unsplash.com');
          const [, query] = line.split(':');
          const theme = query.trim();
          url.search = new URLSearchParams({
            page: '1',
            query: theme,
            client_id: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY as string,
          }).toString();
          const response = await fetch(url);
          const json = await response.json();
          const lastSlide = previousSlides.at(-1);
          if (typeof lastSlide === 'undefined') {
            return previousSlides;
          }
          return [
            ...previousSlides.slice(0, -1),
            {
              ...lastSlide,
              imageUrls: json.results.slice(0, MAXIMUM_IMAGES).map((s: any) => {
                return s.urls.regular;
              }),
              theme,
            }
          ]
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
    if (typeof currentSlide === 'undefined') {
      return;
    }
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    setAppState((oldAppState) => ({
      ...oldAppState,
      slides: oldAppState.slides?.map((s) => (
        s.id === currentSlide.id
          ? {
            ...s,
            [name]: value
          }
          : s
      ))
    }));
  };

  return (
    <main>
      <header className="z-10 fixed top-0 left-0 w-full h-20 px-8 flex items-center justify-between">
        <div className="font-bold leading-none">
          <span className="block text-2xl">
            めちゃくちゃ
          </span>
          {' '}
          <span className="block lowercase">
            Mecha Kucha
          </span>
        </div>
        <div>
          <Link
            href={{
              query: {
                ...router.query,
                input: 'true',
              },
            }}
          >
            {appState.title}
          </Link>
        </div>
        <div>
          <ActionButton
            type="submit"
            variant="primary"
          >
            Save
          </ActionButton>
        </div>
      </header>
      {showInputFormModal && (
        <dialog open className="fixed w-full h-full z-20 bg-black text-white">
          <div className="my-16">
            <div className="max-w-screen-md px-8 mx-auto">
              <InputForm
                key={formKey}
                defaultValues={appState}
                onSubmit={handleInputFormSubmit}
                onReset={handleInputFormReset}
                disabled={inputFormWorking}
              />
            </div>
          </div>
        </dialog>
      )}
      {Array.isArray(appState.slides) && (
        <div className="fixed top-0 left-0 w-full h-full pt-20">
          <div className="flex w-full h-full">
            <div className="w-72 px-8 py-8 h-full overflow-auto">
              <div className="flex flex-col gap-4">
                {appState.slides.map((s) => {
                  return (
                    <div
                      key={s.id}
                    >
                      <Link
                        href={{
                          query: {
                            'slide': s.id,
                          },
                        }}
                        replace
                        className={`hover:opacity-100 ${currentSlide?.id === s.id ? 'opacity-100' : 'opacity-50'}`}
                      >
                        <div
                          className="h-40 rounded border-2 overflow-hidden relative group"
                        >
                          <div className="w-full h-full flex justify-center items-center text-center text-sm">
                            {s.title}
                          </div>
                          <div className="absolute top-0 left-0 w-full h-full">
                            <SlideDisplay
                              slide={s}
                            />
                          </div>
                          <div className="px-2 py-1 line-clamp-2 text-xs absolute -bottom-full group-hover:bottom-0 left-0 w-full bg-black/50">
                            {s.text}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex-auto flex flex-col">
              {currentSlide && (
                <Fragment key={currentSlide.id}>
                  <div className="px-8 py-8 flex justify-center items-center flex-auto">
                  <div className="w-128 h-80 relative border-2 rounded overflow-hidden">
                      <div className="w-full h-full flex justify-center items-center text-3xl text-center">
                        {currentSlide.title}
                      </div>
                      <div className="absolute top-0 left-0 w-full h-full">
                        <SlideDisplay
                          slide={currentSlide}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-8 py-8">
                    <SlideDataForm
                      defaultValues={currentSlide}
                      onFieldChange={handleUpdateCurrentSlide}
                    />
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default IndexPage;
