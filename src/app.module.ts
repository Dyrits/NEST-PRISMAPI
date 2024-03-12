import { Module } from "@nestjs/common";

import { AuthenticationModule } from "./authentication/authentication.module";
import { UserModule } from "./user/user.module";
import { BookmarkModule } from "./bookmark/bookmark.module";

@Module({
  imports: [AuthenticationModule, UserModule, BookmarkModule],
  controllers: [],
  providers: []
})
export class AppModule {}
