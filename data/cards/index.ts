import type { Card } from './_types';
import { ahmad } from './ahmad';
import { ahmadFm } from './ahmad-fm';

export const cards: Record<string, Card> = {
  [ahmad.slug]:   ahmad,
  [ahmadFm.slug]: ahmadFm,
};

export function getCard(slug: string): Card | undefined {
  return cards[slug];
}

export function listCardSlugs(): string[] {
  return Object.keys(cards);
}
