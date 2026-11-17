import { CAJEROS } from '@data/fixtures/cajeros.fixture';
import { CLIENTES } from '@data/fixtures/clientes.fixture';
import { OPERACIONES } from '@data/fixtures/operaciones.fixture';
import { SUCURSALES } from '@data/fixtures/negocio.fixture';
import { USUARIOS_PRUEBA } from '@data/fixtures/usuarios.fixture';
import { PILL_ESTATUS_CLIENTE } from '@data/constants/estatus.constants';
import { RegistroAuditoria } from '@data/interfaces/registro-auditoria';
import { formatearNumero } from '@utils/dinero/formato-dinero';
import { hoyIso, sumarDias } from '@utils/fechas/fechas';

const nombreAdministrador = (id: string | null): string =>
  USUARIOS_PRUEBA.find((u) => u.id === id)?.nombre ?? 'Sistema';

const nombreCajero = (id: string): string =>
  CAJEROS.find((c) => c.id === id)?.nombreCompleto ?? 'Sistema';

/** Minutes after `fecha` (local ISO date-time), as a local ISO date-time. */
function mas(fecha: string, minutos: number): string {
  const [dia, hora] = fecha.split('T');
  const total = Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3, 5)) + minutos;
  const h = String(Math.floor(total / 60)).padStart(2, '0');
  const m = String(total % 60).padStart(2, '0');
  return `${dia}T${h}:${m}:00`;
}

function auditoriaDeOperaciones(): RegistroAuditoria[] {
  return OPERACIONES.flatMap((op) => {
    const registros: RegistroAuditoria[] = [
      {
        id: `${op.id}-registro`,
        entidad: 'operacion',
        entidadId: op.id,
        fecha: op.fechaOperacion,
        usuario: nombreCajero(op.cajeroId),
        accion: 'Operación registrada',
        detalle: `${op.folio}: ${formatearNumero(op.montoUsd)} USD equivalentes.`,
        cambios: [],
      },
    ];
    if (op.requiereAutorizacion) {
      registros.push({
        id: `${op.id}-envio`,
        entidad: 'operacion',
        entidadId: op.id,
        fecha: mas(op.fechaOperacion, 1),
        usuario: 'Sistema',
        accion: 'Enviada a autorización',
        detalle: op.motivoAutorizacion,
        cambios: [],
      });
    }
    if (op.autorizadoEn) {
      registros.push({
        id: `${op.id}-resolucion`,
        entidad: 'operacion',
        entidadId: op.id,
        fecha: op.autorizadoEn,
        usuario: nombreAdministrador(op.autorizadoPorId),
        accion: op.estatus === 'COMPLETADA' ? 'Operación autorizada' : 'Operación no realizada',
        detalle: op.comentarioAutorizacion,
        cambios: [
          {
            campo: 'Estatus',
            antes: 'Pendiente de autorización',
            despues: op.estatus === 'COMPLETADA' ? 'Completada' : 'No realizada',
          },
        ],
      });
    }
    if (op.estatus === 'CANCELADA') {
      registros.push({
        id: `${op.id}-cancelacion`,
        entidad: 'operacion',
        entidadId: op.id,
        fecha: mas(op.fechaOperacion, 6),
        usuario: nombreCajero(op.cajeroId),
        accion: 'Operación cancelada',
        detalle: 'El cliente desistió antes de entregar los recursos.',
        cambios: [{ campo: 'Estatus', antes: 'Completada', despues: 'Cancelada' }],
      });
    }
    return registros;
  });
}

/** The estatus changes the evening of the cliente's latest operation (or a month after the alta). */
export function fechaCambioEstatus(clienteId: string, fechaAlta: string): string {
  const fechas = OPERACIONES.filter((o) => o.clienteId === clienteId).map((o) =>
    o.fechaOperacion.slice(0, 10),
  );
  return `${fechas.length ? fechas.sort().at(-1) : sumarDias(fechaAlta, 30)}T18:00:00`;
}

function auditoriaDeClientes(): RegistroAuditoria[] {
  return CLIENTES.flatMap((cliente) => {
    const registros: RegistroAuditoria[] = [
      {
        id: `${cliente.id}-alta`,
        entidad: 'cliente',
        entidadId: cliente.id,
        fecha: `${cliente.fechaAlta}T10:00:00`,
        usuario: 'Eduardo',
        accion: 'Alta de cliente',
        detalle: `${cliente.numeroCliente}: expediente nivel ${cliente.nivelExpediente}.`,
        cambios: [],
      },
    ];
    if (cliente.estatus !== 'ACTIVO') {
      registros.push({
        id: `${cliente.id}-estatus`,
        entidad: 'cliente',
        entidadId: cliente.id,
        fecha: fechaCambioEstatus(cliente.id, cliente.fechaAlta),
        usuario: 'Fernando',
        accion: 'Cambio de estatus',
        detalle: cliente.motivoEstatus,
        cambios: [
          {
            campo: 'Estatus',
            antes: PILL_ESTATUS_CLIENTE.ACTIVO.etiqueta,
            despues: PILL_ESTATUS_CLIENTE[cliente.estatus].etiqueta,
          },
        ],
      });
    }
    return registros;
  });
}

/** Day the Tijuana sucursal closed, relative to today so it stays after its last operation. */
export const FECHA_BAJA_TIJUANA = sumarDias(hoyIso(), -15);

/** Alta and baja of the sucursales, and the edits of the negocio's profile. */
const AUDITORIA_NEGOCIO: readonly RegistroAuditoria[] = [
  {
    id: 'negocio-alta',
    entidad: 'negocio',
    entidadId: 'centro',
    fecha: '2021-03-15T09:00:00',
    usuario: 'Eduardo',
    accion: 'Alta del negocio',
    detalle: 'Centro Cambiario Demo, S.A. de C.V.',
    cambios: [],
  },
  {
    id: 'negocio-horario',
    entidad: 'negocio',
    entidadId: 'centro',
    fecha: '2026-08-12T11:15:00',
    usuario: 'Fernando',
    accion: 'Datos generales actualizados',
    detalle: null,
    cambios: [
      { campo: 'Horario de atención', antes: 'Lun–Vie 9:00–18:00', despues: 'Lun–Sáb 9:00–18:00' },
    ],
  },
  ...SUCURSALES.map<RegistroAuditoria>((s, i) => ({
    id: `${s.id}-alta`,
    entidad: 'sucursal',
    entidadId: s.id,
    fecha: ['2021-03-15T09:30:00', '2022-06-01T09:30:00', '2023-02-10T09:30:00'][i],
    usuario: 'Eduardo',
    accion: 'Alta de sucursal',
    detalle: `${s.clave}: ${s.nombre}.`,
    cambios: [],
  })),
  {
    id: 'suc-tij-baja',
    entidad: 'sucursal',
    entidadId: 'suc-tij',
    fecha: `${FECHA_BAJA_TIJUANA}T17:45:00`,
    usuario: 'Fernando',
    accion: 'Sucursal dada de baja',
    detalle: 'Cierre de la sucursal; sus operaciones se conservan.',
    cambios: [{ campo: 'Estatus', antes: 'Activa', despues: 'Baja' }],
  },
];

/** Every audit entry of the fixtures. A handler filters it by `entidad` and `entidadId`. */
export const AUDITORIA: readonly RegistroAuditoria[] = [
  ...auditoriaDeOperaciones(),
  ...auditoriaDeClientes(),
  ...AUDITORIA_NEGOCIO,
];
