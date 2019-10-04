import { getConnection } from 'typeorm'
import AdminEntity from '../adminEntity'
import * as request from 'supertest'
import { Group } from '../../exampleApp/src/user/group.entity'
import { JSDOM } from 'jsdom'
import { InvalidAdminRegistration } from '../exceptions/invalidAdminRegistration.exception'
import { createTestingModule, createAndStartTestApp } from './utils/testApp'

describe('adminSite.register', () => {
  let document: Document

  beforeEach(() => {
    const dom = new JSDOM()
    document = dom.window.document
  })

  it('should register an entity', async () => {
    const app = await createAndStartTestApp({ registerEntities: [Group] })
    await app.startTest()

    const server = app.getHttpServer()
    const res = await request(server).get(`/admin`)

    expect(res.status).toBe(200)
    document.documentElement.innerHTML = res.text
    expect(document.querySelector('a[href="/admin/test/group"]')).toBeTruthy()

    await app.stopTest()
    await app.close()
  })

  it('should register an AdminEntity', async () => {
    class GroupAdmin extends AdminEntity {
      entity = Group
    }

    const app = await createAndStartTestApp({ registerEntities: [GroupAdmin] })
    await app.startTest()

    const server = app.getHttpServer()
    const res = await request(server).get(`/admin`)
    expect(res.status).toBe(200)
    document.documentElement.innerHTML = res.text
    expect(document.querySelector('a[href="/admin/test/group"]')).toBeTruthy()

    await app.stopTest()
    await app.close()
  })

  it('should throw an error if you try to register neither an Entity or an AdminEntity', async () => {
    const testingModule = await createTestingModule({ registerEntities: [class {}] })
    expect(
      testingModule.compile().finally(async () => {
        const connection = await getConnection()
        connection.close()
      }),
    ).rejects.toThrow(InvalidAdminRegistration)
  })
})
