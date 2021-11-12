import { IsNotEmpty, IsInt } from 'class-validator';
import { Validator } from './validator';

class TestDto {
  @IsNotEmpty()
  readonly name: string;

  @IsInt()
  readonly age: number;
}

describe('Validator', () => {
  let validator: Validator;

  describe('valid?', () => {
    describe('when the object is valid', () => {
      const obj = {
        name: 'Batman',
        age: 34,
      };

      it('should return true', async () => {
        validator = await Validator.validate(TestDto, obj);
        expect(validator.valid()).toEqual(true);
      });

      it('not have any errors', async () => {
        validator = await Validator.validate(TestDto, obj);
        expect(validator.errors.length).toEqual(0);
      });
    });

    describe('when the object is invalid', () => {
      const obj = {
        name: '',
        age: "Ain't nothing but a number",
      };

      it('should return false', async () => {
        validator = await Validator.validate(TestDto, obj);
        expect(validator.valid()).toEqual(false);
      });

      it('have errors', async () => {
        validator = await Validator.validate(TestDto, obj);
        expect(validator.errors.length).toEqual(2);

        expect(validator.errors[0].property).toEqual('name');
        expect(validator.errors[0].constraints).toEqual({
          isNotEmpty: 'name should not be empty',
        });
        expect(validator.errors[1].property).toEqual('age');
        expect(validator.errors[1].constraints).toEqual({
          isInt: 'age must be an integer number',
        });
      });
    });
  });
});
