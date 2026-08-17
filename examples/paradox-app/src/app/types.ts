export type ExamplePageProps = {
  root?: Element | null;
  [key: string]: unknown;
};

export type MessageContainerProps = {
  callback?: ((data: { message?: string }) => void) | null;
  [key: string]: unknown;
};
