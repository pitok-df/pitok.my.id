import { App, compress, Container } from "@buntok/core";
import { AuthController } from "@/modules/auth";
import { SkillController } from "@/modules/skill";
import { GaleryImageController } from "@/modules/galery-image";

export const app = new App();
app.apiDocs({
  title: "pitok.my.id",
  description: "API Dokumentasi untuk pitok.my.id",
});

app.use(compress());
app.cors({
  origin: ["http://localhost:3000", "https://pitok.my.id"],
  credentials: true,
});

app.static("/resources", "./resources");

const container = new Container();
container.scan([AuthController, SkillController, GaleryImageController]);
app.setContainer(container);

app.registerController([
  AuthController,
  SkillController,
  GaleryImageController,
]);

export default app;
