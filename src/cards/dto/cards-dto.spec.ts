import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCardDto } from './create-card.dto';
import { UpdateCardDto } from './update-card.dto';

describe('card DTO validation', () => {
  const validationOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
  };

  it('accepts a valid card creation payload', async () => {
    const payload = {
      name: 'Cloud, Midgar Mercenary',
      type: 'Legendary Creature',
      rarity: 'Mythic',
      collectorNumber: '001',
      displayOrder: 0,
    };

    const errors = await validate(
      plainToInstance(CreateCardDto, payload),
      validationOptions,
    );

    expect(errors).toHaveLength(0);
  });

  it('rejects unknown card creation properties', async () => {
    const errors = await validate(
      plainToInstance(CreateCardDto, {
        name: 'Cloud',
        type: 'Creature',
        rarity: 'Rare',
        collectorNumber: '001',
        unexpected: true,
      }),
      validationOptions,
    );

    expect(errors.map(({ property }) => property)).toContain('unexpected');
  });

  it('accepts a valid partial card update payload', async () => {
    const errors = await validate(
      plainToInstance(UpdateCardDto, { name: 'Cloud, SOLDIER' }),
      validationOptions,
    );

    expect(errors).toHaveLength(0);
  });

  it('rejects invalid values in card update payloads', async () => {
    const errors = await validate(
      plainToInstance(UpdateCardDto, { displayOrder: -1 }),
      validationOptions,
    );

    expect(errors.map(({ property }) => property)).toContain('displayOrder');
  });
});
