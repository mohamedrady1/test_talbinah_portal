interface Array<T> {
  removeFalsyValues(): T[];
}

Array.prototype.removeFalsyValues = function (): any[] {
  // 'this' refers to the array instance
  return this.filter(Boolean);
};
