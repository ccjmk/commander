export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
  const templatePaths: string[] = [
    // Add paths to "modules/foundry-cli/templates"
  ];

  return loadTemplates(templatePaths);
}
