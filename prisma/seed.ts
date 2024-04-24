import { PrismaClient } from "@prisma/client";
import { hashPassword } from "~/server/utils/bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log('\n')
    console.log('###################################')
    console.log('#      Creating Fixtures...       #')
    console.log('###################################')
    console.log('\n')

    const adminUser = process.env.ADMIN_USER as string
    const adminPassword = process.env.ADMIN_PASSWORD as string
    // create admin user
    await prisma.user.upsert({
        where: {
            username: adminUser
        },
        update: {
            username: adminUser,
            password: await hashPassword(adminPassword),
            role: 'admin'
        },
        create: {
            id: 1,
            username: adminUser,
            password: await hashPassword(adminPassword),
            role: 'admin'
        }
    })
    console.log('- admin user has been created or updated.')

    // create tenants
    const tenantsData = [
        {
            code: 'p1_a1',
            reference: 'Cuarto de la tienda.',
            floor: 1
        }, {
            code: 'p1_a2',
            reference: 'Cuarto entre la cocina y la tienda.',
            floor: 1
        }, {
            code: 'p2_a1',
            reference: 'Primer cuarto al subir las escaleras.',
            floor: 2
        }, {
            code: 'p2_a2',
            reference: 'Cuarto al frente de la lavandería del segundo piso.',
            floor: 2
        }, {
            code: 'p2_a3',
            reference: 'Cuarto que está encima de la cocina.',
            floor: 2
        }, {
            code: 'p3_a1',
            reference: 'Cuarto de la derecha del tercer piso.',
            floor: 3
        }, {
            code: 'p3_a2',
            reference: 'Cuarto de la izquierda del tercer piso.',
            floor: 3
        },
    ]

    tenantsData.forEach(async (tenant) => {
        await prisma.room.upsert({
            where: {
                code: tenant.code
            },
            create: {
                code: tenant.code,
                reference: tenant.reference,
                floor: tenant.floor
            },
            update: {
                code: tenant.code,
                reference: tenant.reference,
                floor: tenant.floor
            }
        })
        console.log(`- tenant '${tenant.code}' has been created or updated.`)
    })

    const servicesData = [
        {
            id: 1,
            name: 'Luz',
            unit: 'kw'
        },
        {
            id: 2,
            name: 'Agua',
            unit: 'm3'
        },
        {
            id: 3,
            name: 'Internet'
        },
        {
            id: 4,
            name: 'Cable'
        },
        {
            id: 5,
            name: 'Renta'
        }
    ]

    servicesData.forEach(async (service) => {
        await prisma.service.upsert({
            where: {
                id: service.id
            },
            create: {
                id: service.id,
                name: service.name,
                unit: service.unit ? service.unit : ""
            },
            update: {
                name: service.name,
                unit: service.unit ? service.unit : ""
            }
        })
        console.log(`- Servicio ${service.id} '${service.name}' has been created or updated.`)
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })

    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)

    })