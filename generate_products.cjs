const categories = {
  "Analgesics": [
    "Cataflam 50mg (Diclofenac)",
    "Brustan-N (Ibuprofen 400mg)"
  ],
  "Anti-infectives": [
    "Fleming 625mg (Amoxicillin+Clavulanic acid)",
    "Zinnat 500mg (Cefuroxime axetil)"
  ],
  "Antidiabetics": [
    "Glucophage 1000mg (Metformin 1000mg)",
    "Daonil 5mg (Glibenclamide 5mg)"
  ],
  "Antifungals": [
    "Flucamed 150mg (Fluconazole 150mg)",
    "Refucil 500mg (Griseofulvin 500mg)",
    "Tabasil (Terbinafine 200mg)"
  ],
  "Antihistamines": [
    "Loratyn 10 (Loratidine 10mg)",
    "Zyncet 10mg (Cetirizine 10mg)"
  ],
  "Antihypertensives": [
    "Amlodipine 10mg",
    "Losartan 50mg"
  ],
  "Antacids": [
    "Gaviscon suspension",
    "Polygel suspension",
    "Mist mag suspension",
    "Gestid suspension",
    "Emtrisil suspension"
  ],
  "Antimalarials": [
    "Amartem softgel forte 80/480mg (Arthemether+Lumefatrine 80/480mg)",
    "Lonart DS (Arthemether+Lumefatrine 80/480mg)",
    "Camosunate (Artesunate+Amodiaquine)",
    "P-alaxin 40/320mg (Dydroartemisinin+piperaquine)"
  ],
  "Antispasmodics": [
    "Buscopan (Hyoscine Butylbromide 10mg)",
    "Phloro-G (Phloroglucinol 80mg)"
  ],
  "Anticonvulsants": [
    "Tegretol (Carbamazepine 200mg)",
    "Epilim (Sodium Valproate 500mg)"
  ],
  "Anti-arthritis": [
    "Boneflex",
    "Arthocare"
  ],
  "Supplements": [
    "Wellman",
    "Wellwoman",
    "Reload Men",
    "Reload Women",
    "Calgovit Vit c 1000mg",
    "Vitamin E 1000mg"
  ],
  "Cough Mixtures": [
    "Emzolyn cough syrup",
    "Neofylin cough syrup",
    "Menthodex syrup",
    "Tuxil-D syrup"
  ],
  "Contraceptives": [
    "Levofem",
    "Postinor-2",
    "Postpill"
  ],
  "Enhancers": [
    "Vega 100 (Sildenafil 100mg)",
    "Viagra (Sildenafil 50mg)",
    "Tadalis (Tadanafil 50mg)",
    "Embagra forte (Sildenafil+Dapoxetine)"
  ],
  "Appetite Stimulants": [
    "Super apeti syrup",
    "Apetamin syrup",
    "Avro apeti syrup",
    "Dynwell syrup"
  ],
  "Fertility & Reproductive Health": [
    "Fertilaid",
    "Clomid (Clomiphene citrate 50mg)"
  ],
  "Hormonal Products": [
    "Dyphaston",
    "Bromergon",
    "Synergo"
  ],
  "Herbal Supplements": [
    "Re-vive"
  ],
  "Topical Products": [
    "Diclomol cream",
    "Neurogesic cream"
  ],
  "Eye Drops": [
    "Diclofenac eye drop",
    "Timolol eye drop",
    "Chloramphenicol eye drop"
  ],
  "Injections": [
    "Rocephin IV (Ceftriaxone 1g)",
    "Cefuroxime 750mg"
  ],
  "Medical Devices": [
    "Omron BP machine",
    "Accu chek Machine",
    "Accu chek strip"
  ],
  "Personal Care": []
};

const customDescriptions = {
  "Cataflam 50mg": "Effective relief from pain, swelling, and inflammation associated with musculoskeletal conditions and arthritis.",
  "Brustan-N": "Dual-action pain relief combining ibuprofen and paracetamol to effectively manage moderate to severe aches and fever.",
  "Fleming 625mg": "A broad-spectrum antibiotic used to treat a wide variety of bacterial infections, including respiratory and skin infections.",
  "Zinnat 500mg": "Highly effective antibiotic indicated for the treatment of susceptible bacterial infections in the throat, ears, and lungs.",
  "Glucophage 1000mg": "A first-line medication for type 2 diabetes that helps control blood sugar levels by improving insulin sensitivity.",
  "Daonil 5mg": "An oral diabetes medicine that helps manage type 2 diabetes by stimulating the pancreas to produce more insulin.",
  "Flucamed 150mg": "A potent antifungal medication designed to effectively clear fungal infections of the skin, nails, and other delicate areas.",
  "Refucil 500mg": "Targeted oral antifungal treatment for persistent dermatophyte infections of the skin, scalp, and nails.",
  "Tabasil": "A highly effective antifungal medicine used for treating difficult fungal infections, including athlete's foot and ringworm.",
  "Loratyn 10": "A non-drowsy antihistamine that provides 24-hour relief from allergy symptoms like sneezing, runny nose, and itchy eyes.",
  "Zyncet 10mg": "Fast-acting antihistamine for effective relief against indoor and outdoor allergies without causing significant drowsiness.",
  "Amlodipine 10mg": "A calcium channel blocker widely used to lower high blood pressure and prevent chest pain (angina).",
  "Losartan 50mg": "An angiotensin receptor blocker (ARB) that relaxes blood vessels to safely lower high blood pressure and protect kidney function.",
  "Gaviscon suspension": "Fast-acting oral suspension that forms a protective barrier over stomach contents to relieve heartburn and acid indigestion.",
  "Polygel suspension": "Soothing antacid formulation designed to quickly neutralize stomach acid and relieve symptoms of gastritis.",
  "Mist mag suspension": "A trusted, effective liquid antacid used to quickly alleviate symptoms of upset stomach and hyperacidity.",
  "Gestid suspension": "Reliable relief from acid indigestion, heartburn, and gas, promoting overall digestive comfort.",
  "Emtrisil suspension": "Gentle and effective antacid suspension formulated to relieve gastrointestinal discomfort and bloating.",
  "Amartem softgel forte 80/480mg": "Highly effective combination antimalarial therapy designed to rapidly clear Plasmodium parasites from the bloodstream.",
  "Lonart DS": "A powerful artemisinin-based combination therapy (ACT) for the rapid and effective treatment of acute, uncomplicated malaria.",
  "Camosunate": "Fast-acting antimalarial combination drug formulated for the effective treatment of multi-drug resistant malaria.",
  "P-alaxin 40/320mg": "A reliable, long-acting antimalarial combination therapy providing complete clearance of malaria parasites.",
  "Buscopan": "Targeted relief from abdominal cramps, pain, and discomfort caused by spasms in the digestive and urinary tracts.",
  "Phloro-G": "An effective antispasmodic medication used to relieve severe smooth muscle spasms in the gastrointestinal tract.",
  "Tegretol": "An established anticonvulsant used to control seizures and provide relief for nerve pain such as trigeminal neuralgia.",
  "Epilim": "A comprehensive medication used to treat various types of epilepsy and manage episodes associated with bipolar disorder.",
  "Boneflex": "A premium joint support supplement formulated to maintain cartilage health and relieve mild arthritis symptoms.",
  "Arthocare": "Advanced joint care formula that provides structural support and helps reduce inflammation and stiffness in joints.",
  "Wellman": "A comprehensive daily multivitamin explicitly formulated to support energy levels, immune health, and vitality in men.",
  "Wellwoman": "A tailored daily multivitamin combining essential nutrients to support female health, energy, and immune defense.",
  "Reload Men": "High-potency nutritional supplement fortified with vitamins and minerals to optimize men's overall health and stamina.",
  "Reload Women": "A complete nutritional formula designed to support women's immune system, bone health, and daily energy needs.",
  "Calgovit Vit c 1000mg": "High-strength Vitamin C supplement that fortifies the immune system, promotes healthy skin, and acts as a powerful antioxidant.",
  "Vitamin E 1000mg": "A potent antioxidant supplement that protects cells from oxidative stress and supports immune and skin health.",
  "Emzolyn cough syrup": "A soothing cough syrup providing rapid relief from dry, irritating coughs and minor throat irritation.",
  "Neofylin cough syrup": "Effective cough and cold formula designed to clear congestion and soothe irritated airways.",
  "Menthodex syrup": "A strong, mentholated cough mixture formulated to provide cooling relief for persistent coughs and chest congestion.",
  "Tuxil-D syrup": "A specialized daytime cough syrup that relieves chesty coughs and loosens mucus without causing drowsiness.",
  "Levofem": "A highly reliable oral contraceptive pill taken daily to safely and effectively prevent unintended pregnancies.",
  "Postinor-2": "A trusted emergency contraceptive pill designed to prevent pregnancy when taken within 72 hours of unprotected sex.",
  "Postpill": "An emergency contraceptive pill that provides a safe and effective backup method for pregnancy prevention.",
  "Vega 100": "A fast-acting male enhancement medication designed to improve blood flow and support reliable erectile function.",
  "Viagra": "The well-known, clinically proven medication used to effectively treat erectile dysfunction in men.",
  "Tadalis": "A long-lasting male enhancement tablet that helps achieve and maintain an erection for up to 36 hours.",
  "Embagra forte": "A dual-action male enhancement medication formulated to treat erectile dysfunction and prevent premature ejaculation.",
  "Super apeti syrup": "An effective appetite stimulant fortified with vitamins to promote healthy weight gain and improve nutritional intake.",
  "Apetamin syrup": "A popular vitamin-enriched syrup designed to significantly boost appetite and support healthy weight management.",
  "Avro apeti syrup": "A gentle appetite stimulant and vitamin supplement suitable for individuals looking to naturally increase food intake.",
  "Dynwell syrup": "A restorative tonic and appetite stimulant formulated to boost energy levels and support recovery after illness.",
  "Fertilaid": "A comprehensive fertility supplement combining essential vitamins and herbs to support reproductive wellness and hormonal balance.",
  "Clomid": "An effective prescription medication used to stimulate ovulation and support female fertility treatments.",
  "Dyphaston": "A synthetic hormone medication used to treat various menstrual disorders, endometriosis, and support pregnancy.",
  "Bromergon": "A medication used to treat hormonal imbalances, specifically high prolactin levels, and certain menstrual cycle issues.",
  "Synergo": "A specialized hormonal therapy product indicated for the management of specific endocrine and reproductive disorders.",
  "Re-vive": "A premium herbal supplement carefully formulated to naturally enhance vitality, energy, and overall wellbeing.",
  "Diclomol cream": "A fast-acting topical analgesic cream providing targeted relief from muscle aches, joint pain, and sprains.",
  "Neurogesic cream": "A soothing, deep-penetrating rub used to relieve nerve pain, muscle soreness, and arthritic discomfort.",
  "Diclofenac eye drop": "A nonsteroidal anti-inflammatory eye drop used to relieve eye pain, swelling, and redness after surgery or injury.",
  "Timolol eye drop": "An effective beta-blocker eye drop prescribed to lower high pressure inside the eye, typically to treat glaucoma.",
  "Chloramphenicol eye drop": "A broad-spectrum antibiotic eye drop used for the rapid treatment of superficial bacterial eye infections.",
  "Rocephin IV": "A potent, injectable broad-spectrum antibiotic used in clinical settings to treat severe or life-threatening bacterial infections.",
  "Cefuroxime 750mg": "An effective injectable cephalosporin antibiotic utilized for the treatment of serious respiratory, soft tissue, and surgical infections.",
  "Omron BP machine": "A highly accurate, clinically validated digital blood pressure monitor for reliable at-home cardiovascular tracking.",
  "Accu chek Machine": "A precise and easy-to-use blood glucose monitoring system designed for effective daily diabetes management.",
  "Accu chek strip": "High-quality test strips compatible with Accu-chek machines, providing rapid and reliable blood glucose readings."
};

const fallbackCategoryDescriptions = {
  "Analgesics": "High quality pain relief medication from our Analgesics selection.",
  "Anti-infectives": "Effective antibiotic and antimicrobial treatment from our Anti-infectives selection.",
  "Antidiabetics": "Reliable diabetes management medication from our Antidiabetics selection.",
  "Antifungals": "Effective antifungal treatment from our Antifungals selection.",
  "Antihistamines": "Fast-acting allergy relief medication from our Antihistamines selection.",
  "Antihypertensives": "Effective blood pressure management medication from our Antihypertensives selection.",
  "Antacids": "Fast-acting relief for heartburn and indigestion from our Antacids selection.",
  "Antimalarials": "Effective antimalarial treatment from our Antimalarials selection.",
  "Antispasmodics": "Reliable relief from cramps and spasms from our Antispasmodics selection.",
  "Anticonvulsants": "Effective medication for seizure and nerve pain management.",
  "Anti-arthritis": "Premium joint care and arthritis relief products.",
  "Supplements": "High quality nutritional supplements and vitamins.",
  "Cough Mixtures": "Effective syrups for cough and cold symptom relief.",
  "Contraceptives": "Reliable and safe contraceptive products.",
  "Enhancers": "Premium male enhancement and performance support products.",
  "Appetite Stimulants": "Effective syrups and tonics to stimulate appetite and promote weight gain.",
  "Fertility & Reproductive Health": "Specialized products supporting fertility and reproductive wellness.",
  "Hormonal Products": "Targeted therapies for hormonal balance and endocrine health.",
  "Herbal Supplements": "Natural herbal remedies for improved vitality and wellness.",
  "Topical Products": "Targeted creams and ointments for local relief and skin care.",
  "Eye Drops": "Specialized drops for eye health, infection treatment, and pressure management.",
  "Injections": "Clinical-grade injectable medications and antibiotics.",
  "Medical Devices": "Reliable and accurate medical equipment for home health monitoring.",
  "Personal Care": "Premium personal care and everyday hygiene products."
};

const products = [];
let id = 1;

for (const [category, items] of Object.entries(categories)) {
  for (const item of items) {
    let name = item;
    let genericName = "";
    if (item.includes("(")) {
      const parts = item.split("(");
      name = parts[0].trim();
      genericName = parts[1].replace(")", "").trim();
    }
    
    // Find custom description by exactly matching or partially matching the name
    let desc = customDescriptions[name];
    if (!desc) {
      // fallback
      desc = fallbackCategoryDescriptions[category] || `High quality ${name} from our ${category} selection.`;
    }
    
    products.push({
      id: String(id++),
      name: name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      brand: "Various",
      genericName: genericName,
      description: desc,
      price: Math.floor(Math.random() * (5000 - 500) + 500),
      rating: 4.5 + Math.random() * 0.5,
      stockQuantity: Math.floor(Math.random() * 100) + 10,
      lowStockThreshold: 10,
      prescriptionRequired: false,
      pharmacistReviewRequired: false,
      active: true,
      featured: id <= 8,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400&h=400',
      category: category,
      categoryId: category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
}

const fs = require('fs');
fs.writeFileSync('src/data/mockProducts.ts', 
`import { Product } from '../types';

export const mockProducts: Product[] = ${JSON.stringify(products, null, 2)};
`);

const allCats = Object.keys(categories);
fs.writeFileSync('src/data/categories.ts',
`export const CATEGORIES = ${JSON.stringify(allCats, null, 2)};
`);

console.log("Done");
