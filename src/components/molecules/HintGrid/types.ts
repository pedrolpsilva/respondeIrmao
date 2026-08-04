export interface HintGridProps {
  totalHints: number;
  revealedIndices: number[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}
