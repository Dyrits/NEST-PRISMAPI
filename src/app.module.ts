import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthenticationModule } from "./authentication/authentication.module";
import { UserModule } from "./user/user.module";
import { BookmarkModule } from "./bookmark/bookmark.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthenticationModule, UserModule, BookmarkModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
