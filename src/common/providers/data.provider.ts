import { Status } from '../../common/enum/status.enum';
import { ObjectLiteral, Repository } from 'typeorm';

export class DataProvider<Entity extends ObjectLiteral> {
  constructor(private readonly _repository: Repository<Entity>) {}

  /**
   * Set the status of the entity as Active
   * @param {Entity} entity - entity to activate
   * @param {number} [user] - User performing the request
   * @returns {Promise<Entity>} - Activated Entity
   */
  protected async activateByStatus(
    entity: Entity,
    user?: number,
  ): Promise<Entity> {
    return this.updateEntity(entity, { status: Status.ACTIVE }, user);
  }

  /**
   * Set the status of the entity as Deleted
   * @param {Entity} entity - entity to delete
   * @param {number} [user] - User performing the request
   * @returns {Promise<Entity>} - Deleted Entity
   */
  protected async deleteByStatus(
    entity: Entity,
    user?: number,
  ): Promise<Entity> {
    return this.updateEntity(entity, { status: Status.DELETED }, user);
  }

  /**
   * Generate Random Code by Length
   * @param {number} length - length of the code to be generated
   * @returns {string} - Code generated
   */
  protected generateRandomCodeByLength(
    length: number,
    options?: string,
  ): string {
    let result = '';

    const characters =
      options && options.trim() !== '' ? options : process.env.ENCRYPTION_CHARS;
    console.log(process.env.ENCRYPTION_CHARS);

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return result;
  }

  /**
   * Set the status of the entity as Inactive
   * @param {Entity} entity - entity to inactivate
   * @param {number} [user] - User performing the request
   * @returns {Promise<Entity>} - Inactivated Entity
   */
  protected async inactivateByStatus(
    entity: Entity,
    user?: number,
  ): Promise<Entity> {
    return this.updateEntity(entity, { status: Status.INACTIVE }, user);
  }

  /**
   * Save entity
   * @param {*} data - Data to save in database
   * @param {number} [user] - User performing the request
   * @returns {Promise<Entity>} - Entity saved
   */
  protected async save(data: any): Promise<Entity> {
    data.status =
      !data.status || data.status.trim() === '' ? 'Active' : data.status.trim();
    return this.cleanDataAfterSave(await this._repository.save(data));
  }

  /**
   * Save entity and Get Relations
   * @param {*} data - Data to save in database
   * @param {number} [user] - User performing the request
   * @returns {Promise<Entity>} - Entity saved
   */
  protected async saveAndGetRelations(
    data: any,
    relations: string[],
  ): Promise<Entity> {
    data.status =
      !data.status || data.status.trim() === '' ? 'Active' : data.status.trim();

    const savedEntity = await this._repository.save(data);

    return this.cleanDataAfterSave(
      await this._repository.findOne(savedEntity.id, { relations }),
    );
  }

  /**
   * Update an entity
   * @param {Entity} entity - entity in database
   * @param {*} dataToUpdate - Data to be updated
   * @param {number} [user] - User performing the request
   * @returns {Promise<Entity>} - Entity Updated
   */
  protected async updateEntity(
    entity: Entity,
    dataToUpdate: any,
    user?: number,
  ): Promise<Entity> {
    if (!isNaN(+user)) {
      dataToUpdate.modifier = +user;
    }
    this._repository.merge(entity, dataToUpdate);
    return this.cleanDataAfterSave(await this._repository.save(entity));
  }

  /**
   * Clean Entity Data after saving it in the database
   * @param {Entity} entity - entity saved in database
   * @returns {Promise<Entity>} - Entity Cleaned
   */
  private cleanDataAfterSave(data: Entity): Entity {
    delete data.creationDate;
    delete data.modificationDate;

    return data;
  }
}
