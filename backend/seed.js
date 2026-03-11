const { faker } = require('@faker-js/faker');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const supabase = require('./supabaseClient');
const sequelize = require('./db');
const Company = require('./models/Company');
const Tender = require('./models/Tender');
const User = require('./models/User');

async function uploadToBucket(bucketName, fileName) {
    const imgUrl = `https://picsum.photos/seed/${faker.string.uuid()}/400/300`;
    const localPath = path.join(__dirname, 'tmp', fileName);

    const res = await axios({ url: imgUrl, responseType: 'stream' });
    await fs.promises.mkdir(path.dirname(localPath), { recursive: true });
    const writer = fs.createWriteStream(localPath);
    res.data.pipe(writer);

    await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });

    const fileBuffer = await fs.promises.readFile(localPath);
    const uploadRes = await supabase.storage
        .from(bucketName)
        .upload(`${Date.now()}-${fileName}`, fileBuffer, {
            contentType: 'image/jpeg',
        });

    await fs.promises.unlink(localPath);

    if (uploadRes.error) {
        console.error(`❌ Upload to ${bucketName} failed:`, uploadRes.error.message);
        return null;
    }

    const { data: publicData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(uploadRes.data.path);

    return publicData.publicUrl;
}

const categories = [
    "Construction & Civil Works",
    "Information Technology (IT)",
    "Electrical Equipment & Works",
    "Healthcare & Medical Equipment",
    "Roads & Bridges",
    "Education & Training",
    "Consultancy Services",
    "Agriculture & Allied Services",
    "Transportation & Logistics",
    "Telecommunications",
    "Security Services",
    "Water Supply & Sanitation",
    "Office Equipment & Stationery",
    "Environmental Services",
    "Machinery & Industrial Supplies"
];

async function seedData() {
    try {
        await sequelize.sync({ alter: true });

        for (let i = 0; i < 20; i++) {
            const user = await User.create({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: 'password123',
                phone: faker.phone.number('9#########'),
            });

            const logoUrl = await uploadToBucket('company-logos', `logo-${i}.jpg`);
            const coverUrl = await uploadToBucket('company-coverimage', `cover-${i}-main.jpg`);

            // Pick a consistent category to be used as both industry and category
            const category = faker.helpers.arrayElement(categories);

            const company = await Company.create({
                name: faker.company.name(),
                email: faker.internet.email(),
                phone: faker.phone.number('9#########'),
                category, // optional if your model has it
                location: faker.location.city(),
                address: faker.location.streetAddress(),
                industry: category, // ✅ MATCHING category
                website: faker.internet.url(),
                description: faker.company.catchPhrase(),
                logo: logoUrl,
                coverImage: coverUrl,
                userId: user.id,
            });

            const tenderCount = faker.number.int({ min: 2, max: 3 });

            for (let j = 0; j < tenderCount; j++) {
                const tenderCover = await uploadToBucket('company-coverimage', `cover-${i}-${j}.jpg`);

                await Tender.create({
                    title: faker.commerce.productName(),
                    description: faker.lorem.sentences(2),
                    budget: faker.number.int({ min: 50000, max: 500000 }),
                    deadline: faker.date.soon({ days: 30 }),
                    location: faker.location.city(),
                    category, // ✅ use same category as company industry
                    coverImage: tenderCover,
                    company_id: company.id,
                    user_id: user.id,
                });
            }
        }

        console.log('✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seedData();