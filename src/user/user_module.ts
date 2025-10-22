import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user_service';
import { User, UserSchema } from './schemas/user-schema'


@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name:  User.name, schema: UserSchema }]
    ),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}



// @Module({
//   imports: [
//     MongooseModule.forFeature(
//       [{ name:  User.name, schema: UserSchema }],
//       'usersConnection', // 👈 harus sama dengan nama koneksi
//     ),
//   ],
//   providers: [UserService],
//   exports: [UserService],
// })
// export class UserModule {}
