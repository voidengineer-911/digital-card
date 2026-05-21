import type { Card } from '@/lib/types';
import { NardoLux } from './templates/NardoLux';
import { ForceBrand } from './templates/ForceBrand';
import { LocaleProvider } from '@/lib/locale-context';

type Props = { card: Card; url: string };

export function CardLayout({ card, url }: Props) {
  return (
    <LocaleProvider initial={card.defaultLocale}>
      {card.template === 'lux'
        ? <NardoLux   card={card} url={url} />
        : <ForceBrand card={card} url={url} />}
    </LocaleProvider>
  );
}
