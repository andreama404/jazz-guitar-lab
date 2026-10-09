import { Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ROOTS } from '../scales/scale-theory';

/** The `root` query parameter of the current page (C when missing or not valid). Call in an injection context. */
export function injectRoot(): Signal<string> {
  const route = inject(ActivatedRoute);
  const params = toSignal(route.queryParamMap, { initialValue: route.snapshot.queryParamMap });
  return computed(() => {
    const root = params().get('root');
    return root !== null && ROOTS.includes(root) ? root : ROOTS[0];
  });
}
