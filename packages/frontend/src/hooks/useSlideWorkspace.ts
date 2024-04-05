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
      const parentWidth = parent.clientWidth - parseFloat(parentStyles.paddingLeft) - parseFloat(parentStyles.paddingRight);
      const parentHeight = parent.clientHeight - parseFloat(parentStyles.paddingTop) - parseFloat(parentStyles.paddingBottom);
      const parentAspectRatio = parentWidth / parentHeight;
      const currentAspectRatio = 16 / 9;

      if (parentAspectRatio < currentAspectRatio) {
        current.style.width = `${parentWidth}px`;
        current.style.height = `${parentWidth * (1 / currentAspectRatio)}px`;
        return;
      }

      current.style.width = `${parentHeight * currentAspectRatio}px`;
      current.style.height = `${parentHeight}px`;
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
    params.router?.events.on('routeChangeComplete', refresh);
    return () => {
      params.router?.events.off('routeChangeComplete', refresh);
    };
  }, [params.router, refresh]);

  return {
    mainSlideDisplayRef,
    refresh,
  };
};
