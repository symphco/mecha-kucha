import { NextPage } from 'next';
import {ChangeEventHandler, FormEventHandler, Fragment, useState} from 'react';
import {ActionButton} from '@/components/molecules/ActionButton';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {AppState, MAXIMUM_IMAGES, Slide, SLIDE_LAYOUTS} from '@/common';
import {InputForm} from '@/components/organisms/InputForm';
import {SlideDataForm} from '@/components/organisms/SlideDataForm';
import {SlideDisplay} from '@/components/molecules/SlideDisplay';
import {useInputForm} from '@/hooks/useInputForm';

const IndexPage: NextPage = () => {
  const router = useRouter();
  const {
    inputFormWorking,
    handleInputFormReset,
    handleInputFormSubmit,
    handleUpdateCurrentSlide,
    appState,
    formKey,
  } = useInputForm();

  const currentSlide = appState.slides?.find((s) => s.id === router.query.slide);
  const showInputFormModal = typeof appState.title === 'undefined' || typeof appState.input === 'undefined' || typeof router.query.input === 'string';

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
