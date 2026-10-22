// Ask Ellie glossary
// wing: "bio" (biological cycle), "tech" (technical cycle) or "both" (shared / body)
// cs: true = case-sensitive (acronyms and proper names)
// aliases: other spellings that count as the same term
// Spaces and hyphens are interchangeable, and plurals are matched automatically (not for cs terms).
// "CHECK" = wing choice worth a second opinion.

export const GLOSSARY = [
  // Organisations & Frameworks
  { phrase: "Ellen MacArthur Foundation", cat: "Organisations & Frameworks", wing: "both", cs: true, def: "A global charity working to create a circular economy, providing thought leadership, education, and business engagement on CE topics." },
  { phrase: "Ellen MacArthur", cat: "Organisations & Frameworks", wing: "both", cs: true, def: "Founder of the Ellen MacArthur Foundation, which has become the world's leading circular economy organisation." },
  { phrase: "EMF", cat: "Organisations & Frameworks", wing: "both", cs: true, def: "Ellen MacArthur Foundation, a global charity driving the transition to a circular economy." },
  { phrase: "circular economy network", cat: "Organisations & Frameworks", wing: "both", def: "A community or group of organisations collaborating to advance circular economy principles and practice." },
  { phrase: "Butterfly Diagram", cat: "Organisations & Frameworks", wing: "both", def: "The Ellen MacArthur Foundation's visual model showing how materials flow through biological and technical cycles in a circular economy." },
  { phrase: "ReSOLVE", cat: "Organisations & Frameworks", wing: "both", cs: true, def: "An EMF framework of six circular economy business strategies: Regenerate, Share, Optimise, Loop, Virtualise, Exchange." },
  { phrase: "New Plastics Economy", cat: "Organisations & Frameworks", wing: "tech", cs: true, def: "An EMF-led global initiative applying circular economy principles to rethink the future of plastics." },
  { phrase: "Make Fashion Circular", cat: "Organisations & Frameworks", wing: "both", cs: true, def: "An EMF initiative working with fashion industry leaders to build a circular fashion economy." },
  { phrase: "Cities and Circular Economy", cat: "Organisations & Frameworks", wing: "both", cs: true, def: "An EMF programme exploring how circular economy principles can be applied at city level." },
  { phrase: "circular economy in cities", cat: "Organisations & Frameworks", wing: "both", def: "Applying circular economy principles at a city level to reduce waste, emissions and resource consumption." },
  { phrase: "Waste and Resources Action Programme", cat: "Organisations & Frameworks", wing: "both", cs: true, aliases: ["WRAP"], def: "A UK charity working to tackle climate change by helping businesses, governments and people reduce waste and use resources sustainably. Also known as WRAP." },
  { phrase: "Circle Economy", cat: "Organisations & Frameworks", wing: "both", cs: true, def: "An Amsterdam-based circular economy consultancy that works with businesses and governments to accelerate the transition to a circular economy." },
  { phrase: "Cradle to Cradle Products Innovation Institute", cat: "Organisations & Frameworks", wing: "both", cs: true, def: "A global non-profit organisation that promotes the Cradle to Cradle Certified product standard for safe, circular and responsibly made products." },
  { phrase: "World Economic Forum", cat: "Organisations & Frameworks", wing: "both", cs: true, aliases: ["WEF"], def: "An international organisation for public-private cooperation that regularly publishes research and initiatives on circular economy and sustainability. Also known as WEF." },
  { phrase: "United Nations Environment Programme", cat: "Organisations & Frameworks", wing: "both", cs: true, aliases: ["UNEP"], def: "The leading global environmental authority within the UN system, setting the environmental agenda and promoting sustainable development. Also known as UNEP." },
  { phrase: "European Environment Agency", cat: "Organisations & Frameworks", wing: "both", cs: true, aliases: ["EEA"], def: "An EU agency providing sound, independent information on the environment to support European policy on sustainability and the circular economy. Also known as EEA." },
  { phrase: "Fairtrade", cat: "Organisations & Frameworks", wing: "both", cs: true, def: "An international certification and advocacy organisation promoting fair trading conditions and sustainable supply chains for producers in developing countries." },
  { phrase: "Carbon Trust", cat: "Organisations & Frameworks", wing: "both", cs: true, def: "A UK-based organisation helping businesses, governments and the public sector to accelerate the move to a sustainable, low-carbon economy." },
  { phrase: "British Standards Institution", cat: "Organisations & Frameworks", wing: "both", cs: true, aliases: ["BSI"], def: "The UK national standards body, publishing standards relevant to sustainability, product design and circular economy practices. Also known as BSI." },
  { phrase: "Institute of Environmental Management and Assessment", cat: "Organisations & Frameworks", wing: "both", cs: true, aliases: ["IEMA"], def: "The professional body for environment and sustainability professionals in the UK. Also known as IEMA." },
  { phrase: "Metabolic", cat: "Organisations & Frameworks", wing: "both", cs: true, def: "An Amsterdam-based circular economy consultancy and venture builder, frequently cited alongside the Ellen MacArthur Foundation in CE research." },
  { phrase: "Chatham House", cat: "Organisations & Frameworks", wing: "both", cs: true, def: "The Royal Institute of International Affairs, a London-based policy institute that publishes influential research on sustainability, circular economy and resource policy." },

  // Core Concepts
  { phrase: "circular economy", cat: "Core Concepts", wing: "both", def: "An economic system aimed at eliminating waste by keeping products, materials and resources in use for as long as possible." },
  { phrase: "circularity", cat: "Core Concepts", wing: "both", def: "The degree to which resources cycle back into the economy rather than becoming waste." },
  { phrase: "closed loop", cat: "Core Concepts", wing: "tech", check: true, def: "A system where materials are continuously cycled back into production with no waste leaving the loop." },
  { phrase: "cradle to cradle", cat: "Core Concepts", wing: "both", def: "A design philosophy where all materials are either safely returned to nature or cycled back into industry indefinitely." },
  { phrase: "cradle to grave", cat: "Core Concepts", wing: "both", def: "A linear approach where materials are used once and then discarded, the opposite of circular thinking." },
  { phrase: "linear economy", cat: "Core Concepts", wing: "both", def: "The traditional take-make-waste model where resources are extracted, used, and disposed of." },
  { phrase: "take-make-waste", cat: "Core Concepts", wing: "both", def: "Shorthand for the linear economy model: extract, manufacture, discard." },
  { phrase: "regenerative", cat: "Core Concepts", wing: "bio", def: "Systems that restore, renew or revitalise their own sources of energy and materials." },
  { phrase: "restorative", cat: "Core Concepts", wing: "both", check: true, def: "Designed to rebuild natural systems and replenish resources rather than deplete them." },
  { phrase: "resource efficiency", cat: "Core Concepts", wing: "both", def: "Using fewer natural resources to produce the same output, reducing environmental impact." },
  { phrase: "waste prevention", cat: "Core Concepts", wing: "both", def: "Reducing the amount of waste generated at source, before it needs to be managed." },
  { phrase: "waste hierarchy", cat: "Core Concepts", wing: "tech", check: true, def: "A priority order for waste management: prevent, reduce, reuse, recycle, recover, dispose." },
  { phrase: "biological cycle", cat: "Core Concepts", wing: "bio", def: "The loop in which biological materials safely re-enter nature through composting or anaerobic digestion." },
  { phrase: "technical cycle", cat: "Core Concepts", wing: "tech", def: "The loop in which technical materials such as metals and plastics are recovered and reused in production." },
  { phrase: "systems thinking", cat: "Core Concepts", wing: "both", def: "Understanding how a system's components interrelate and work over time within larger systems." },

  // Business Models
  { phrase: "product as a service", cat: "Business Models", wing: "tech", def: "A model where customers pay for the use of a product rather than owning it, keeping the manufacturer responsible for its end of life." },
  { phrase: "performance economy", cat: "Business Models", wing: "tech", def: "Selling the performance or outcome of a product rather than the product itself." },
  { phrase: "pay per use", cat: "Business Models", wing: "tech", def: "A pricing model where customers are charged based on how much they use a product or service." },
  { phrase: "sharing economy", cat: "Business Models", wing: "tech", def: "An economic system where assets or services are shared between private individuals, reducing the need for new production." },
  { phrase: "remanufacturing", cat: "Business Models", wing: "tech", def: "Restoring used products to their original specifications, typically with a warranty comparable to new products." },
  { phrase: "refurbishment", cat: "Business Models", wing: "tech", def: "Returning a used product to good working condition, often with cosmetic improvements." },
  { phrase: "take-back scheme", cat: "Business Models", wing: "tech", def: "A programme where manufacturers collect used products at end of life for reuse, recycling or safe disposal." },
  { phrase: "deposit scheme", cat: "Business Models", wing: "tech", def: "A system where consumers pay a deposit refunded when the item is returned for reuse or recycling." },
  { phrase: "extended producer responsibility", cat: "Business Models", wing: "tech", aliases: [{ text: "EPR", cs: true }], def: "A policy approach where producers are given financial or physical responsibility for products at end of life. Also known as EPR." },
  { phrase: "reverse logistics", cat: "Business Models", wing: "tech", def: "The process of moving goods from customers back to manufacturers for return, reuse or recycling." },
  { phrase: "servitisation", cat: "Business Models", wing: "tech", aliases: ["servitization"], def: "The shift from selling products to selling the services those products provide." },
  { phrase: "industrial symbiosis", cat: "Business Models", wing: "both", check: true, def: "A system where waste or by-products from one industry become inputs for another." },

  // Materials & Waste
  { phrase: "upcycling", cat: "Materials & Waste", wing: "tech", check: true, def: "Converting waste or used materials into something of higher quality or value." },
  { phrase: "downcycling", cat: "Materials & Waste", wing: "tech", def: "Recycling material into a lower-quality product, often losing value with each cycle." },
  { phrase: "composting", cat: "Materials & Waste", wing: "bio", def: "The controlled decomposition of organic matter into nutrient-rich material for soil." },
  { phrase: "anaerobic digestion", cat: "Materials & Waste", wing: "bio", def: "Breaking down organic materials without oxygen to produce biogas and digestate." },
  { phrase: "biodegradable", cat: "Materials & Waste", wing: "bio", def: "Capable of being decomposed by bacteria or other living organisms." },
  { phrase: "bio-based", cat: "Materials & Waste", wing: "bio", aliases: ["biobased"], def: "Derived from biological resources such as plants, animals or microorganisms." },
  { phrase: "secondary raw material", cat: "Materials & Waste", wing: "tech", def: "Material recovered from waste that can be reintroduced into the production process." },
  { phrase: "waste stream", cat: "Materials & Waste", wing: "both", def: "The complete flow of waste from its source through to recovery, recycling or disposal." },
  { phrase: "by-product", cat: "Materials & Waste", wing: "both", def: "A secondary product derived from a manufacturing process, which may have value in another context." },
  { phrase: "virgin material", cat: "Materials & Waste", wing: "both", def: "New, unprocessed raw material extracted directly from natural sources." },
  { phrase: "end of life", cat: "Materials & Waste", wing: "both", def: "The stage at which a product or material can no longer be used for its intended purpose." },
  { phrase: "landfill", cat: "Materials & Waste", wing: "both", def: "Disposal of waste by burying it, the least preferred option in the waste hierarchy." },

  // Design Principles
  { phrase: "design for disassembly", cat: "Design Principles", wing: "tech", def: "Designing products so components can be easily separated at end of life for reuse or recycling." },
  { phrase: "design for longevity", cat: "Design Principles", wing: "tech", def: "Creating products built to last, reducing the frequency of replacement." },
  { phrase: "design for repair", cat: "Design Principles", wing: "tech", def: "Ensuring products can be easily fixed, with available spare parts and accessible components." },
  { phrase: "modular design", cat: "Design Principles", wing: "tech", def: "Designing products in interchangeable components so parts can be upgraded, replaced or repurposed." },
  { phrase: "ecodesign", cat: "Design Principles", wing: "both", aliases: ["eco-design"], def: "Integrating environmental considerations into product design to reduce impact throughout the lifecycle." },
  { phrase: "durability", cat: "Design Principles", wing: "tech", def: "The ability of a product to remain functional and in good condition over an extended period." },
  { phrase: "repairability", cat: "Design Principles", wing: "tech", aliases: ["reparability"], def: "How easily a product can be fixed when it breaks." },
  { phrase: "product lifecycle", cat: "Design Principles", wing: "both", aliases: ["product life cycle"], def: "The stages a product goes through from raw material extraction through manufacture, use, and end of life." },
  { phrase: "lifecycle assessment", cat: "Design Principles", wing: "both", aliases: ["life cycle assessment"], def: "A technique to assess the environmental impact of a product through all stages of its life." },
  { phrase: "right to repair", cat: "Design Principles", wing: "tech", def: "A movement ensuring consumers can fix their own products or have them repaired affordably." },
  { phrase: "planned obsolescence", cat: "Design Principles", wing: "tech", def: "Deliberately designing products with a limited lifespan to encourage repeat purchases." },

  // Policy & Systems
  { phrase: "net zero", cat: "Policy & Systems", wing: "both", def: "Balancing the amount of greenhouse gas emitted with the amount removed from the atmosphere." },
  { phrase: "carbon footprint", cat: "Policy & Systems", wing: "both", def: "The total amount of greenhouse gases generated by human actions, expressed as CO₂ equivalent." },
  { phrase: "decarbonisation", cat: "Policy & Systems", wing: "both", aliases: ["decarbonization"], def: "The process of reducing or eliminating carbon dioxide emissions from energy generation and industry." },
  { phrase: "green economy", cat: "Policy & Systems", wing: "both", def: "An economy that results in improved human wellbeing while significantly reducing environmental risk." },
  { phrase: "sustainability", cat: "Policy & Systems", wing: "both", def: "Meeting the needs of the present without compromising the ability of future generations to meet their own needs." },
  { phrase: "supply chain", cat: "Policy & Systems", wing: "both", def: "The network of organisations involved in producing and delivering a product to the end consumer." },
  { phrase: "value chain", cat: "Policy & Systems", wing: "both", def: "The full range of activities that businesses go through to bring a product to market." },
  { phrase: "scope 3", cat: "Policy & Systems", wing: "both", def: "Indirect greenhouse gas emissions in a company's value chain, including suppliers and product use." },
  { phrase: "plastic pollution", cat: "Policy & Systems", wing: "tech", check: true, def: "The accumulation of plastic objects in the environment that adversely affects humans, wildlife and habitats." },
  { phrase: "food waste", cat: "Policy & Systems", wing: "bio", def: "Food lost or discarded during production, processing, distribution, or consumption." },
  { phrase: "fast fashion", cat: "Policy & Systems", wing: "both", check: true, def: "A high-volume, low-cost clothing model that encourages rapid consumption and disposal of garments." },
].map((t, i) => ({ id: "g" + i, ...t }));

export const CATEGORIES = {
  "Organisations & Frameworks": { short: "Orgs",      icon: "users" },
  "Core Concepts":              { short: "Core",      icon: "loop" },
  "Business Models":            { short: "Business",  icon: "store" },
  "Materials & Waste":          { short: "Materials", icon: "box" },
  "Design Principles":          { short: "Design",    icon: "pencil" },
  "Policy & Systems":           { short: "Policy",    icon: "scale" },
  "Custom":                     { short: "Custom",    icon: "star" },
};

export const WINGS = {
  bio:  { label: "Biological", icon: "leaf" },
  tech: { label: "Technical",  icon: "cog" },
  both: { label: "Both wings", icon: "loop" },
};
