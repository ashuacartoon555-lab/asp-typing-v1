declare module '@indic-transliteration/sanscript' {
  interface SanscriptApi {
    t(input: string, from: string, to: string, options?: Record<string, unknown>): string;
  }

  const Sanscript: SanscriptApi;
  export default Sanscript;
}
