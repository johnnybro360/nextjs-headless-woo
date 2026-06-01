type WpPageContentProps = {
  html: string;
};

export function WpPageContent({ html }: WpPageContentProps) {
  return (
    <div
      className="prose-static wp-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
