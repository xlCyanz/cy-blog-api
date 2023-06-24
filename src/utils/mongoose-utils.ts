import { Types } from "mongoose";
import { BadRequestException, HttpStatus } from "@nestjs/common";

export default class MongooseUtils {
  /**
   * Method to convert a string to ObjectId bson.
   *
   * Generate a BadRequestException if string is not a valid ObjectId.
   *
   * @param userId - The categoryId to check.
   */
  static stringToObjectId(userId: string, exceptionMessage?: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        messageCode: exceptionMessage,
      });
    }
    return new Types.ObjectId(userId);
  }
}
