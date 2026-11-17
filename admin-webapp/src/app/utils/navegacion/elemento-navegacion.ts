import { NAVEGACION } from '@data/constants/navegacion.constants';
import { ElementoNavegacion } from '@data/interfaces/elemento-navegacion';

/** The nav entry of a module route (`operaciones`). Throws on a route the nav doesn't list: a bug, not a state. */
export function elementoPorRuta(ruta: string): ElementoNavegacion {
  const elemento = NAVEGACION.flatMap((grupo) => grupo.elementos).find((e) => e.ruta === ruta);
  if (!elemento) throw new Error(`La ruta «${ruta}» no está en la navegación.`);
  return elemento;
}
