import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    name: {
      type: String,
      required: [true, '書籍名稱為必填'],
      unique: true,
      trim: true,
      minlength: [1, '書籍名稱不能為空'],
      maxlength: [100, '書籍名稱不能超過 100 字元']
    }
  },
  {
    timestamps: true
  }
);

// 建立索引以提升查詢效能
bookSchema.index({ name: 1 });

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;
