import { Schema, model } from 'mongoose';

// Здесь описание схемы пользователя

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: [true, 'A value for this field is required'],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [true, 'A value for this field is required'],
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: [true, 'A value for this field is required'],
  },
}, {
  versionKey: false,
  timestamps: true,
});

// Создаю на основе схемы модель, чтобы превратить заготовку в документ
export default model<IUser>('user', userSchema);
