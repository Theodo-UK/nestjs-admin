import { createConnection, getConnectionOptions } from 'typeorm'
import * as faker from 'faker'
import { range as _range } from 'lodash'
import { AdminUserEntity } from 'nestjs-admin'
import { User } from '../src/user/user.entity'
import { Group } from '../src/user/group.entity'
import { Agency } from '../src/user/agency.entity'

function createAdmin() {
  const user = new AdminUserEntity()
  user.username = 'admin'
  user.password = 'admin'
  return user
}

function createRandomUser(agencies: Agency[], groups: Group[]) {
  const user = new User()
  user.firstName = faker.name.firstName()
  user.lastName = faker.name.lastName()
  user.email = faker.internet.email()
  user.password = faker.internet.password()
  user.roles = _range(faker.random.number(10)).map(() => faker.name.jobType())
  user.moreRoles = _range(faker.random.number(3)).map(() => faker.name.jobType())
  user.description = faker.lorem.paragraph()
  user.weight = faker.random.number(100)
  user.age = faker.random.number(90)
  user.numberOfSiblings = faker.random.number(3)
  user.fingerCount = faker.random.number({ min: 8, max: 10 })
  user.atomCount = faker.random.number(Number.MAX_SAFE_INTEGER)
  user.height = faker.random.number({ min: 1.5, max: 2.1, precision: 2 })

  if (faker.random.boolean()) {
    user.agency = agencies[faker.random.number(agencies.length - 1)]
  }

  return user
}

function createRandomAgency() {
  const agency = new Agency()
  agency.name = faker.company.companyName()

  return agency
}

function createRandomGroup() {
  const group = new Group()
  group.name = faker.lorem.word()

  return group
}

async function seed() {
  const options = await getConnectionOptions()
  const entities = [AdminUserEntity, User, Agency, Group]
  const connection = await createConnection({ ...options, entities })

  const adminRepository = connection.getRepository(AdminUserEntity)
  const userRepository = connection.getRepository(User)
  const agencyRepository = connection.getRepository(Agency)
  const groupRepository = connection.getRepository(Group)

  console.log('Creating admin...')
  const admin = createAdmin()
  await adminRepository.save(admin)

  console.log('Creating agencies...')
  let agencies = _range(10).map(createRandomAgency)
  agencies = await agencyRepository.save(agencies)

  console.log('Creating groups...')
  let groups = _range(20).map(createRandomGroup)
  groups = await groupRepository.save(groups)

  console.log('Creating users...')
  let users = _range(100).map(() => createRandomUser(agencies, groups))
  users = await userRepository.save(users)
}

seed()
