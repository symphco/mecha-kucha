import { NextPage } from 'next';
import {DragEventHandler, Fragment} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {InputForm} from '@/components/organisms/InputForm';
import {SlideDataForm} from '@/components/organisms/SlideDataForm';
import {SlideDisplay} from '@/components/molecules/SlideDisplay';
import {useInputForm} from '@/hooks/useInputForm';
import {PresentationActionForm} from '@/components/organisms/PresentationActionForm';
import {useSlideWorkspace} from '@/hooks/useSlideWorkspace';
import {Brand} from '@/components/molecules/Brand';

const cancelEvent: DragEventHandler<HTMLElement> = (e) => {
  e.preventDefault();
};

const IndexPage: NextPage = () => {
  const router = useRouter();
  const { mainSlideDisplayRef, refresh } = useSlideWorkspace({
    router,
  });
  const {
    inputFormWorking,
    handlePresentationActionFormSubmit,
    handleInputFormReset,
    handleInputFormSubmit,
    handleUpdateCurrentSlide,
    handleWindowDrop,
    handleSlideDataAction,
    handleCurrentSlideImageLoaded,
    handleCurrentSlideImageRegenerate,
    appState,
    formKey,
    slideImageLoading,
    working,
  } = useInputForm({ refresh });

  const currentSlide = appState.slides?.find((s) => s.id === router.query.slide);
  const showInputFormModal = typeof router.query.input === 'string';

  return (
    <>
      <main
        className="w-full h-full pt-20"
        onDragEnter={cancelEvent}
        onDragOver={cancelEvent}
        onDrop={handleWindowDrop}
      >
        <header className="z-10 fixed top-0 left-0 w-full h-20 px-8 flex gap-8 items-center justify-between">
          <div>
            <Brand />
          </div>
          <div className={`text-center ${working ? 'pointer-events-none opacity-50' : ''}`.trim()}>
            <Link
              href={{
                query: {
                  ...router.query,
                  input: 'true',
                },
              }}
              className="font-bold text-xl"
            >
              {appState.title}
            </Link>
          </div>
          <div>
            <PresentationActionForm
              onSubmit={handlePresentationActionFormSubmit}
              defaultValues={appState}
              disabled={typeof working !== 'undefined'}
              working={working}
            />
          </div>
        </header>
        {Array.isArray(appState.slides) && (
          <div className="flex w-full h-full">
            <div className="w-72 px-8 py-8 h-full overflow-auto">
              <div className="flex flex-col gap-4">
                {appState.slides.map((s, i) => {
                  return (
                    <div
                      key={s.id}
                      className={working ? 'pointer-events-none opacity-50' : ''}
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
                          className="w-full aspect-w-16 aspect-h-9 rounded border-2 overflow-hidden group"
                          style={{
                            backgroundColor: s.color,
                          }}
                        >
                          <div>
                            <div className="relative w-full h-full">
                              <div className="w-full h-full flex justify-center items-center text-center text-sm">
                                {s.title.trim() || `Slide ${i + 1}`}
                              </div>
                              <div className="absolute top-0 left-0 w-full h-full">
                                <SlideDisplay
                                  slide={s}
                                />
                              </div>
                              <div className="px-2 py-1 line-clamp-2 text-xs absolute -bottom-full group-hover:bottom-0 left-0 w-full bg-black/50">
                                {s.text.trim() || `Slide ${i + 1}`}
                              </div>
                            </div>
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
                  <div className={`flex-auto min-h-0 relative ${working ? 'pointer-events-none opacity-50' : ''}`.trim()}>
                    <div className="absolute top-0 left-0 w-full h-full px-16 py-16 flex items-center justify-center">
                      <div
                        ref={mainSlideDisplayRef}
                        style={{
                          backgroundColor: currentSlide.color,
                        }}
                        className="relative border-2 rounded"
                      >
                        <div className="absolute top-0 left-0 w-full h-full">
                          <div className="relative w-full h-full">
                            <div className="w-full h-full flex justify-center items-center text-3xl text-center">
                              {currentSlide.title.trim() || `Slide ${appState.slides.findIndex((s) => s.id === currentSlide.id) + 1}`}
                            </div>
                            <div className="absolute top-0 left-0 w-full h-full">
                              <SlideDisplay
                                slide={currentSlide}
                                imagesLoading={slideImageLoading}
                                onImageLoad={handleCurrentSlideImageLoaded}
                                hasActions
                                onAction={handleCurrentSlideImageRegenerate}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-8 py-8 flex-shrink-0">
                    <SlideDataForm
                      defaultValues={currentSlide}
                      onFieldChange={handleUpdateCurrentSlide}
                      onSubmit={handleSlideDataAction}
                      disabled={typeof working !== 'undefined'}
                    />
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        )}
      </main>
      <dialog
        open={showInputFormModal}
        className="fixed top-0 left-0 w-full h-full bg-black text-white z-10"
        onDragEnter={cancelEvent}
        onDragOver={cancelEvent}
        onDrop={handleWindowDrop}
      >
        <div className="my-16">
          <div className="max-w-screen-md px-8 mx-auto">
            <div className="mb-8">
              <div className="mb-4 text-3xl">
                <Brand />
              </div>
              <div className="text-xl font-bold">
                Create beautiful presentations with AI.
              </div>
            </div>
            <InputForm
              key={formKey}
              defaultValues={appState}
              onSubmit={handleInputFormSubmit}
              onReset={handleInputFormReset}
              disabled={inputFormWorking || typeof working !== 'undefined'}
            />
          </div>
        </div>
      </dialog>
    </>
  );
};

export default IndexPage;
