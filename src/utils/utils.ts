import { Types } from "mongoose";
import { BadRequestException, HttpStatus } from "@nestjs/common";

export default class Utils {
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
        message: exceptionMessage || "Object id is invalid",
      });
    }

    return new Types.ObjectId(userId);
  }
}
