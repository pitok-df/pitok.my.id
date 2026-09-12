import { App, compress, Container } from "@buntok/core";
import { AuthController } from "@/modules/auth";
import { SkillController } from "@/modules/skill";
import { UploaderController } from "@/modules/uploader";

export const app = new App();
app.apiDocs();

app.use(compress());
app.cors({
  origin: ["http://localhost:3000", "https://pitok.my.id"],
  credentials: true,
});

app.static("/resources", "./resources");

const container = new Container();
container.scan([AuthController, SkillController, UploaderController]);
app.setContainer(container);

app.registerController([AuthController, SkillController, UploaderController]);

export default app;
