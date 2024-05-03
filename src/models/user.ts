// eslint-disable-next-line import/no-extraneous-dependencies
import validator from 'validator';
import {
  Schema,
  model,
  Model,
  Document,
} from 'mongoose';
import bcrypt from 'bcrypt';
// Здесь описание схемы пользователя

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}
interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}
const userSchema = new Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, {
  versionKey: false,
  timestamps: true,
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Wrong email or password'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Wrong email or password'));
          }
          return user;
        });
    });
});

// Создаю на основе схемы модель, чтобы превратить заготовку в документ
export default model<IUser, IUserModel>('user', userSchema);
