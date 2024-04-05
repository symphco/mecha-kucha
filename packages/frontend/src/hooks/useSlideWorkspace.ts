import {useCallback, useEffect, useRef} from 'react';
import {NextRouter} from 'next/router';

interface UseSlideWorkspaceParams {
  router: NextRouter;
}

export const useSlideWorkspace = (params = {} as UseSlideWorkspaceParams) => {
  const mainSlideDisplayRef = useRef<HTMLElementTagNameMap['div']>(null);
  const timeoutRef = useRef<number>();

  const refresh = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      const { current } = mainSlideDisplayRef;
      if (!current) {
        return;
      }
      const parent = current.parentElement;
      if (!parent) {
        return;
      }

      const parentStyles = window.getComputedStyle(parent);
      const parentAspectRatio = (
        parent.clientWidth - parseFloat(parentStyles.paddingLeft) - parseFloat(parentStyles.paddingRight)
      ) / (
        parent.clientHeight - parseFloat(parentStyles.paddingTop) - parseFloat(parentStyles.paddingBottom)
      );
      const currentAspectRatio = 16 / 9;

      if (parentAspectRatio < currentAspectRatio) {
        current.style.width = '100%';
        current.style.height = `${current.clientWidth * (1 / currentAspectRatio)}px`;
        return;
      }

      current.style.width = `${current.clientHeight * currentAspectRatio}px`;
      current.style.height = '100%';
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', refresh);
    return () => {
      window.removeEventListener('resize', refresh);
    };
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const listen = () => {
      refresh();
    };

    params.router?.events.on('routeChangeComplete', listen);
    return () => {
       params.router?.events.off('routeChangeComplete', listen);
    };
  }, [params.router?.events, refresh]);

  return {
    mainSlideDisplayRef,
    refresh,
  };
};
