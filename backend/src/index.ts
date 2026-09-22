import { App, Container } from "@buntok/core";
import { AuthController } from "@/modules/auth";
import { SkillController } from "@/modules/skill";
import { GaleryImageController } from "@/modules/galery-image";
import { ProjectController } from "@/modules/project";
import { compress } from "@buntok/core";

export const app = new App();
app.disable("x-powered-by");
app.apiDocs({
  title: "pitok.my.id",
  description: "API Dokumentasi untuk pitok.my.id",
  safeOnProduction: true,
});

app.use(compress());
app.cors({
  origin: ["http://localhost:3000", "https://pitok.my.id"],
  credentials: true,
});

app.static("/resources", "./resources");

const container = new Container();
container.scan([
  AuthController,
  SkillController,
  GaleryImageController,
  ProjectController,
]);
app.setContainer(container);

app.registerController([
  AuthController,
  SkillController,
  GaleryImageController,
  ProjectController,
]);

export default app;
