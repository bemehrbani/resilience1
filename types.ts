export interface Category {
  id: number;
  title: string;
  description: string;
}

export interface Question {
  id: number;
  categoryId: number;
  text: string;
}

export interface LikertOption {
  value: number;
  label: string;
  colorClass: string;
}

export interface ScoreResult {
  min: number;
  max: number;
  title: string;
  color: 'green' | 'blue' | 'orange' | 'red';
  description?: string;
}