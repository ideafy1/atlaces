// Quick test: Simulates what the serverless function returns for a specific therapist slug

async function testSEO(slug) {
  console.log(`\n--- Testing slug: "${slug}" ---\n`);

  const apiKey = 'AIzaSyAD7XnA-ooSfl88zlfZKIUtu7IEK54QO1M';
  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/brainheal-india/databases/(default)/documents/website/content?key=${apiKey}`;
  const response = await fetch(firestoreUrl);
  const data = await response.json();

  const tp = data.fields?.therapyPage?.mapValue?.fields;
  const therapists = tp?.therapists?.arrayValue?.values || [];

  let found = false;
  for (const entry of therapists) {
    const t = entry.mapValue?.fields;
    if (!t) continue;

    const name = t.name?.stringValue || '';
    const storedSlug = t.slug?.stringValue || '';
    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

    if (storedSlug === slug || generatedSlug === slug) {
      const title = t.title?.stringValue || 'Therapist';
      const image = t.image?.stringValue || 'N/A';
      const credentials = t.credentials?.stringValue || '';
      
      let specs = [];
      if (t.specialties?.arrayValue?.values) {
        specs = t.specialties.arrayValue.values.map(v => v.stringValue).filter(Boolean);
      }

      console.log('✅ MATCHED!');
      console.log(`   Name: ${name}`);
      console.log(`   Title: ${title}`);
      console.log(`   Credentials: ${credentials}`);
      console.log(`   Image: ${image}`);
      console.log(`   Specialties: ${specs.join(', ')}`);
      console.log(`   og:title → "${name} - ${title} | Atlaces"`);
      found = true;
      break;
    }
  }

  if (!found) {
    console.log('❌ No therapist matched this slug!');
    console.log('   Available slugs:');
    for (const entry of therapists) {
      const t = entry.mapValue?.fields;
      const name = t?.name?.stringValue || '';
      const stored = t?.slug?.stringValue || '';
      const generated = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
      console.log(`   - stored: "${stored}" | generated: "${generated}" | name: "${name}"`);
    }
  }
}

// Test all possible slug formats
await testSEO('kiara-shah');
await testSEO('kiarashah');
await testSEO('rishu-singh');
await testSEO('rishusingh');
