import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { CALENDAR_ES, DATE_PICKER_ES, dateFromIso } from '@utils/dates/calendar';
import { fechaLocalIso } from '@utils/fechas/fechas';

/**
 * A date field on Spartan's date picker: it shows `dd/mm/aaaa` in Spanish on every browser and
 * holds an ISO date string (`2026-11-16`, empty when unset), like the URL and the API. Use it with
 * `[formControl]`, or with `[value]` + `(valueChange)` outside a form (the Filtros popover).
 */
@Component({
  selector: 'app-date-field',
  imports: [HlmDatePickerImports],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateField), multi: true },
    // Spanish, dd/mm/aaaa, weeks from Monday (lead, 2026-11-20). Provided here, not in app.config,
    // so the date picker stays out of the initial bundle.
    provideBrnCalendarI18n(CALENDAR_ES),
    provideHlmDatePickerConfig(DATE_PICKER_ES),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './date-field.html',
  host: { class: 'block' },
})
export class DateField implements ControlValueAccessor {
  readonly buttonId = input.required<string>();
  /** Outside a form: the ISO date to show. */
  readonly value = input<string | null | undefined>(undefined);
  readonly placeholder = input('dd/mm/aaaa');
  readonly invalid = input(false);
  readonly describedBy = input<string | null>(null);

  readonly valueChange = output<string>();

  /** What a form wrote; a bound `value` wins. */
  private readonly written = signal<string>('');
  protected readonly disabled = signal(false);

  protected readonly date = computed(() => dateFromIso(this.value() ?? this.written()));

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.written.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  protected pick(date: Date | null): void {
    const iso = date ? fechaLocalIso(date) : '';
    this.written.set(iso);
    this.onChange(iso);
    this.onTouched();
    this.valueChange.emit(iso);
  }
}
