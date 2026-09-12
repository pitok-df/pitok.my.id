import { App, compress, Container, cors } from "@buntok/core";
// import { AuthController } from "./controllers/auth.controller";
// import { UploaderController } from "./controllers/uploader.controller";
// import { SkillController } from "./controllers/skill.controller";

export const app = new App();
app.apiDocs();
app.use(compress());
app.cors({
  origin: ["http://localhost:3000", "https://pitok.my.id"],
  credentials: true,
});

// app.static("/resources", "./resources");

// const container = new Container();
// container.scan([SkillController, AuthController, UploaderController]);
// app.setContainer(container);

// app.registerController(AuthController);
// app.registerController(UploaderController);
// app.registerController(SkillController);
app.icon();
app.get("/", () => "Hello World!");

export default app;
