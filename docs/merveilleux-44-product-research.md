# Merveilleux 44 个主要产品研究清单

研究日期：2026-08-13
研究范围：MÉRVÉILLÉUX / Merveilleux 护肤产品、专业护理与体验套装
用途：中英文产品文案、产品图片收集、中文价格表制作前的资料底稿

逐产品完整字段（中英概述、成分、功效、用法、风险措辞与内部来源编号）见 `docs/merveilleux-44-detailed-profiles.md`；44 张图片的使用状态见 `output/merveilleux-studio-44/README.md`。

## 结论先行

- 当前可确认 **44 个产品家族**：项目内已有 42 份双语资料卡，另外两项为 **Blemish Serum** 与 **Advanced Bio Peptide Treatment**。
- 若按可销售规格（SKU）计算则是 **45 个 SKU**，因为 **Cell Repair Powder** 有 3 g 与 10 g 两个规格。这解释了项目清单写“45 SKUs”、沟通中说“44 个产品”的差异。
- 公开零售目录可交叉核对 27 个常规零售产品；其余疗程、套装或较新的项目主要来自品牌方内部聊天资料/宣传图。
- `public/products/` 的 27 个文件实际覆盖 26 个产品家族（冻干粉有两种规格）；再结合项目内 7 张套装/面膜切图及公开零售图，本轮可为 **34 个产品家族**建立真实包装参考。其余 **10 个**因没有足够清晰的独立包装原图，只制作了明确标名 `CONCEPT` 的视觉概念图，不能当作正式包装定稿。
- 价格暂不能直接称为“最终官方价”。内部资料卡与公开经销商价格常有 RM10 差异，另有少数规格差异；最终中文价格表应以 Grace/品牌方确认的 2026 西马、东马价为准。

## 44 个产品家族总表

“内部价”来自 `content/extracted/zh/*.json`；“待确认”表示现有材料不足，不能补猜。主要功效和成分是资料整理用摘要，不应替代包装 INCI、使用说明或法规审核。

| # | 类别 | Product name (EN) | 产品名（中文） | 规格 | 内部价 | 主要功效 | 已知主要成分/组成 | 证据状态 |
|---:|---|---|---|---|---:|---|---|---|
| 1 | 专业护理 | Advance White Professional Treatment | 钻石水光美白护理疗程 | 待确认 | 待确认 | 一次护理结合提亮、紧致与水光感 | AW Caviar Lime Enzyme、AW Active Complex、AW Treatment Serum | 内部资料卡 |
| 2 | 面膜 | Aqua-Concentrate Mask | 深层保湿面膜 | 50 ml | RM128 | 密集补水，改善干燥 | Sodium Hyaluronate、Aloe Barbadensis Leaf Extract、Propylene Glycol | 内部资料卡 + 公开零售 |
| 3 | 体验套装 | Brightening + Hydrating Trial Set | 亮白补水体验套装 | 3 items | RM288 | 亮白与补水体验 | 公开套装页列 Hydro-Sensi Concentré、Oxy-Bright Serum、Hydro-Moist Serum；现有组合切图只清晰显示 Oxy-Bright 与 Hydro-Moist 的正装/小样，装箱前须向品牌确认 | 内部资料卡 + 公开套装页；存在图片/文字冲突 |
| 4 | 修复舒缓 | Cell Repair Treatment Cream | 修复屏障乳霜 | 30 ml | RM228 | 重建并强化皮肤屏障 | Ergothioneine、Sodium Hyaluronate、Niacinamide | 内部资料卡 + 公开零售 |
| 5 | 爽肤喷雾 | Ceramide Ice-Essence Toner | 神经酰胺爽肤水 | 内部 150 ml；公开 100 ml | RM178 | 补水、减少水分流失、强化屏障 | Ceramide NS、Sodium Hyaluronate、Maris Aqua | 规格/价格冲突，待品牌方确认 |
| 6 | 体验套装 | Congested Set | 净化调理体验套装 | 3 items | RM260 | 针对堵塞、闭口与毛孔问题 | Intensive Restoration Serum、Pore Refining Serum、Hydro-Sensi Concentré；现有切图只清晰显示 Restoration 与 Pore 的正装/小样，须确认第三件外观 | 内部资料卡 + 公开套装页；存在图片/文字冲突 |
| 7 | 体验套装 | Daily Care Trial Set | 日常护理体验套装 | 3 items | RM168 | 基础清洁与爽肤体验 | Cleansing Milk 30 ml、Cleansing Gel 20 ml、Ice-Essence Toner 30 ml | 内部资料卡 |
| 8 | 爽肤喷雾 | Essential Lotion (Toner) | 玫瑰爽肤水 | 150 ml | RM178 | 补水、修护、帮助改善毛孔观感 | Rose Essence、Aloe Vera、Vitamin B5 | 内部资料卡 + 公开零售 |
| 9 | 眼部护理 | Eye EGF Serum | EGF 眼部修护精华 | 待确认 | 待确认 | 润泽眼周，改善干燥与细纹观感 | sh-Oligopeptide-1 (EGF)、Palmitoyl Tripeptide-1/-5、Squalane | 内部资料卡，规格/价格待确认 |
| 10 | 清洁卸妆 | Gentle Cleansing Milk | 温和洁面乳 | 200 ml | RM168 | 温和清洁，舒缓并减少紧绷 | Chamomilla Recutita Extract、Anthemis Nobilis Flower Extract、Magnesium Chloride | 内部资料卡 + 公开零售 |
| 11 | 补水保湿 | Hyaluronate Moisturiser | 玻尿酸保湿乳霜 | 30 ml | RM188 | 保湿、柔滑并提升弹润感 | Sodium Hyaluronate、Tamarindus Indica Extract、Aloe Vera Extract | 内部资料卡 + 公开零售 |
| 12 | 补水保湿 | Hydro-Moist Serum | 大分子玻尿酸精华 | 30 ml | RM228 | 锁水、形成保护膜并改善细纹观感 | Ceramide 3、Witch Hazel Water、Sodium Hyaluronate | 内部资料卡 + 公开零售 + DagangHalal |
| 13 | 补水保湿 | Hydro-Sensi Concentré | 小分子玻尿酸精华 | 30 ml | RM218 | 深层补水、舒缓敏感不适 | Sodium Hyaluronate、Aloe Vera、Chamomile | 内部资料卡 + 公开零售 |
| 14 | 眼部护理 | Intense Lift Eye Treatment Crème | 紧致提拉眼部护理霜 | 20 ml | RM228 | 改善细纹、眼袋与松弛观感 | White Truffle Extract、Palmitoyl Tripeptide-1/-8、Acetyl Heptapeptide-4 | 内部资料卡 + 公开零售 |
| 15 | 面膜 | Intensive Hydro-Treatment Silk Mask | 深层补水蚕丝面膜 | 5 pcs | RM168 | 深层补水，改善干燥、粗糙与疲倦肌 | 完整 INCI 待确认 | 内部资料卡 |
| 16 | 专业护理 | Intensive Medic-Cell Treatment | 细胞医学炎症调理护理疗程 | 待确认 | 待确认 | 舒缓炎症、修复屏障并调理肌肤状态 | Medic Cell Powder、Stem Cell Lyophilised Powder、Soothing Gel Mask | 内部资料卡，疗程步骤/用量待确认 |
| 17 | 修复舒缓 | Intensive Restoration Powder / Cell Repair Powder | 冻干粉 | 3 g、10 g | 内部 10 g RM328 | 舒缓敏感、支持受损肌肤修护 | Dipotassium Glycyrrhizate、Opuntia Stem Extract、Trehalose | 1 个产品家族、2 个 SKU；公开价 3 g RM108 / 10 g RM318 |
| 18 | 修复舒缓 | Intensive Restoration Serum | 优越修复精华 | 30 ml | RM298 | 减少泛红与敏感不适，支持屏障修护 | Dipotassium Glycyrrhizate、Allantoin、Serine | 内部资料卡 |
| 19 | 面膜 | Intensive Restoration Treatment Silk Mask | 深层修复蚕丝面膜 | 5 pcs | RM178 | 舒缓薄弱角质层与敏感肌，帮助减少水分流失 | Dipotassium Glycyrrhizate | 内部资料卡 + 公开零售 |
| 20 | 面膜 | Medic ICE Hydro-Soothing Mask | 医用冰镇保湿退红舒缓面膜 | 待确认 | 待确认 | 快速降温、补水、舒缓泛红 | Allantoin、Panthenol、Sodium Hyaluronate | 内部资料卡，规格/价格待确认 |
| 21 | 修复舒缓 | Medic-Restore Gel | 医学修复凝胶 | 待确认 | 待确认 | 舒缓炎症、泛红与不适，强化屏障 | Aqua、Bifida Ferment Lysate、Glycerin | 内部资料卡，规格/价格待确认 |
| 22 | 清洁卸妆 | Micellaire Solution | 净颜卸妆水 | 内部 100 ml；公开 120 ml | RM128 | 卸除彩妆、防晒与污垢 | Rosa Rugosa Flower Extract、PEG-6 Caprylic/Capric Glycerides | 规格/价格冲突，待品牌方确认 |
| 23 | 爽肤喷雾 | Micro Nano Mist | 细胞能量微小纳米喷雾 | 100 ml | RM138 | 即时补水、舒缓并支持屏障稳定 | Aqua、Witch Hazel Water、Licorice Root Water | 内部资料卡 + 公开零售 |
| 24 | 面膜 | O2 Clear Bubble Mask | O2 净化泡泡面膜 | 待确认 | 待确认 | 起泡清洁、净化毛孔与多余油脂 | 完整 INCI 待确认 | 内部资料卡，规格/价格待确认 |
| 25 | 亮白 | Oxy-Bright Serum | 美白精华 | 30 ml | RM308 | 改善暗沉、粗糙与肤色不均 | Camu Camu Extract、Beet Root、Honey | 内部资料卡 + 公开零售 |
| 26 | 体验套装 | Pimples Trial Set | 祛痘体验套装 | 3 items | RM260 | 针对痘痘、炎症与敏感不适 | Restoration Serum 10 ml、Blemish Serum 5 ml、Hydro-Sensi Concentré 10 ml | 内部资料卡 |
| 27 | 专业护理 | PlantCell Salon Treatment | PlantCell 双安瓶沙龙护理 | 待确认 | 待确认 | 提亮、补水并改善色素不均观感 | Whitening Ampoules、Hydrating Ampoules、Medic Ice Mask | 内部资料卡，疗程步骤/用量待确认 |
| 28 | 净痘调理 | Pore Refining Serum | 消炎抗痘精华 | 15 ml | RM168 | 疏通毛孔，改善黑白头与炎症痘 | Sophora Root Extract、Phellodendron Bark Extract、Neem Leaf Extract | 内部资料卡 + 公开零售 |
| 29 | 防晒 | Refined HA UV Shield SPF35 | 肤色保湿防晒 | 30 ml | RM188 | UVA/UVB 防护、润色并保湿 | Aqua、Sodium Hyaluronate、Witch Hazel Water | 内部资料卡 + 公开零售 |
| 30 | 补水保湿 | Refined Hydro-Care | 舒缓镇静乳霜 | 内部 50 ml；公开 30 ml | RM248 | 补水、舒缓并支持屏障修护 | Aqua、Sodium Hyaluronate、Aloe Barbadensis Extract | 重大规格/价格冲突，待品牌方确认 |
| 31 | 修复舒缓 | Repair Treatment Oil | 修复精华油 | 待确认 | 待确认 | 滋润并支持干裂、受损肌肤修护 | Deep-Sea Fish Roe Lipid Oil | 内部资料卡，完整 INCI/规格/价格待确认 |
| 32 | 体验套装 | Repairing + Hydrating Trial Set | 修复补水体验套装 | 3 items | RM288 | 修复与补水体验 | Restoration Serum 10 ml、Hydro-Sensi Concentré 10 ml、Hydro-Moist Serum 10 ml | 内部资料卡 |
| 33 | 抗老紧致 | Revitalise Anti-Oxidant Crème | 抗老修复面霜 | 30 g | RM278 | 保湿、抗氧化并改善紧致度 | Astaxanthin、Hexapeptide-8、Haematococcus Pluvialis Extract | 内部资料卡 + 公开零售 |
| 34 | 抗老紧致 | Revitalise Anti-Oxidant Essence | 抗氧化精华 | 30 ml | RM258 | 改善弹性、细纹与暗沉观感 | Astaxanthin、Hexapeptide-8、Dipotassium Glycyrrhizate | 内部资料卡 + 公开零售 |
| 35 | 抗老紧致 | Revitalise Anti-Oxidant Serum | 抗老化精华 | 30 ml | RM258 | 支持胶原弹力，改善松弛与细纹 | Astaxanthin、Hexapeptide-8、Dipotassium Glycyrrhizate | 内部资料卡 + 公开零售 |
| 36 | 补水保湿 | Essence Oil — Rose + Rosemary Leaf | 玫瑰迷迭香精油 | 20 ml | RM218 | 滋养、锁水并改善干燥粗糙 | Olive Fruit Oil、Rose Flower Oil、Rosemary Leaf Oil | 内部资料卡 + 公开零售 |
| 37 | 面膜 | Soothing Gel Mask / Hydra Soothing Gel Mask | 舒缓修复凝胶膜 | 50 ml | RM158 | 降温、舒缓并补水 | Cucumber Extract、Algae Extract、Glycerin | 内部资料卡 + 公开零售；英文命名待统一 |
| 38 | 清洁卸妆 | Ultrafine Cleansing Gel | 精华蜜状洁面凝胶 | 150 ml | RM158 | 温和清洁并帮助维持肌肤 pH | Amino Acid complex、Licorice Root Extract、Scutellaria Root Extract | 内部资料卡 + 公开零售 |
| 39 | 防晒 | UV Protection SPF35/PA+++ | 轻盈保湿防晒 | 30 ml | RM178 | 轻盈不油腻的 UVA/UVB 防护 | Aqua、Hyaluronic Acid、Microcrystalline Silica | 内部资料卡 + 公开零售 |
| 40 | 防晒 | Vital Perfect UV SPF30 | 完美保湿防晒 SPF30 | 30 ml | RM188 | 防晒、保湿并帮助平衡油脂 | Sodium Hyaluronate、Microcrystalline Silica、Cyclopentasiloxane | 内部资料卡 |
| 41 | 亮白 | Whitening Stem Cell | 亮白干细胞精华 | 待确认 | 待确认 | 提亮并支持肌肤更新 | 完整 INCI 待确认 | 内部资料卡，规格/价格待确认 |
| 42 | 亮白 | Youth-HA Moisturiser | 美白锁水乳霜 | 30 ml | RM188 | 补水、提亮并改善肤色不均 | Sodium Hyaluronate、Niacinamide、Rose Flower Water | 内部资料卡 + 公开零售 |
| 43 | 净痘调理 | Blemish Serum | 祛痘修复精华 | 15 ml（套装内 5 ml） | 公开 RM138 | 针对痘痘、瑕疵与炎症肌 | 完整 INCI 待确认 | 产品清单 + 公开零售；尚缺独立内部资料卡 |
| 44 | 专业护理 | Advanced Bio Peptide Treatment | 深海胜肽胶原蛋白护理 | 待确认 | 待确认 | 改善弹性、细纹、干燥、暗沉与粗糙观感 | 宣传资料称深海胶原蛋白/胜肽；完整配方待确认 | 产品清单 + 品牌 HQ 宣传；尚缺独立内部资料卡 |

## Studio 产品图交付与覆盖情况

本轮已输出 **44 张、编号 01–44、统一 1000 × 1250 px（4:5 竖版）**的 Studio 产品视觉，统一采用暖象牙无缝背景、浅洞石台座与左上柔光。文件位于 `output/merveilleux-studio-44/`。

- **34 张真实参考重拍图**：依据项目切图、Wonderful Beauty 公开零售图或可追溯的市场销售图生成；仍建议在正式印刷/上线前对微小标签文字做人工校样。
- **10 张概念图**：01、09、16、20、21、24、27、31、41、44。文件名均含 `CONCEPT`，对应 Advance White、Eye EGF、Medic-Cell、Medic ICE、Medic-Restore Gel、O2 Clear、PlantCell、Repair Treatment Oil、Whitening Stem Cell、Advanced Bio Peptide。取得品牌原始包装照后应重做替换。
- 一张错误标成 30 ml 的 Blemish 初稿已从正式目录移出；正式 43 号图明确为 15 ml。

项目内 `public/products/` 有 27 个文件：

`silk-mask`、`refined-hydro-care`、`cell-repair-cream`、`eye-treatment-creme`、`hydro-sensi-concentre`、`antioxidant-cream`、`micellaire-solution`、`uv-protection-spf35`、`blemish-serum`、`ultrafine-cleansing-gel`、`pore-refining-serum`、`hyaluronate-moisturiser`、`cell-repair-powder-3g`、`oxy-bright-serum`、`gentle-cleansing-milk`、`youth-ha-moisturiser`、`essential-lotion-toner`、`ceramide-toner`、`hydro-moist-serum`、`aqua-concentrate-mask`、`hydra-soothing-gel-mask`、`antioxidant-serum`、`micro-nano-mist`、`essence-oil`、`cell-repair-powder`、`antioxidant-essence`、`uv-shield-spf35`。

其中冻干粉 3 g/10 g 占两个文件，因此是 26 个产品家族。项目内另有 7 张套装/面膜组合图；公开市场检索补到 Intensive Restoration Serum 与 Vital Perfect UV 的可辨识参考。仍缺真实包装原图的 10 个项目应向品牌方索取：

1. 透明底或纯白底原图，建议长边至少 2000 px；
2. 正面、背面标签与外盒各一张，便于核对规格、INCI、用法、警示和产地；
3. 套装合照和每个内含物单品照；
4. 专业疗程的包装、安瓶/粉剂/凝胶组件照，不使用顾客治疗前后图代替产品照；
5. 明确网站、目录和社交媒体的使用授权。

## 价格与规格冲突

公开经销商目录看起来仍在销售 27 个常规零售产品，但很多价格比内部资料卡低 RM10，例如 Gentle Cleansing Milk（公开 RM158，内部 RM168）、Hydro-Moist Serum（公开 RM218，内部 RM228）、Oxy-Bright Serum（公开 RM298，内部 RM308）。这更像旧经销商价格与新版内部价格并存，不能据此自动判断哪一份是最新官方价。

需要优先确认的重大差异：

- Ceramide Ice-Essence Toner：内部 150 ml / RM178；公开 100 ml / RM168。
- Micellaire Solution：内部 100 ml / RM128；公开 120 ml / RM118。
- Refined Hydro-Care：内部 50 ml / RM248；公开 30 ml / RM178。
- Cell Repair Powder：内部 10 g / RM328；公开 10 g / RM318，另有 3 g / RM108。
- Soothing Gel Mask：内部名称为 Soothing Gel Mask / RM158；公开名称为 Hydra Soothing Gel Mask / RM148。

## 制作四页中文价格表前必须取得的资料

1. 2026 有效日期与版本号；
2. 西马、东马分别的建议零售价；
3. 经销商价、批发价、最低订购量及是否含 SST（如适用）；
4. 44 个产品家族与 45 个 SKU 的最终取舍；
5. 11 个尚无价格项目的价格或“仅供疗程/不单卖”状态；
6. 3 个规格冲突项目的正式包装规格；
7. 体验套装实际装箱内容，尤其 Brightening + Hydrating Trial Set 与 Congested Set 的图片/文字冲突；
8. 所有防晒产品可公开使用的 SPF/PA 测试与标签资料；
9. 品牌方批准的功效措辞，避免把“治疗、医用、细胞再生、抗菌、术后愈合”等高风险宣传语直接放到消费者页面。

## 资料来源

- 项目内部 42 份双语资料卡：`content/extracted/zh/`
- 项目产品/SKU 清单：`sku-manifest.csv`
- 项目本地产品图片：`public/products/`
- [Merveilleux Skin Care Instagram](https://www.instagram.com/merveilleuxskincare_sbn/)
- [Wonderful Beauty 的 Merveilleux 27 项公开零售目录](https://wonderfulbeauty.com.my/product-category/merveilleux/)
- [Wonderful Beauty：Purifying Care（Blemish Serum 与 Pore Refining Serum）](https://wonderfulbeauty.com.my/product-category/merveilleux/purifying-care/)
- [Wonderful Beauty：Cleanser, Mist & Lotion](https://wonderfulbeauty.com.my/product-category/merveilleux/cleanser-mist-lotion/)
- [Wonderful Beauty：Hydrating & Moisture Care](https://wonderfulbeauty.com.my/product-category/merveilleux/hydrating-moisture-care/)
- [Wonderful Beauty：Soothing & Repairing Care](https://wonderfulbeauty.com.my/product-category/merveilleux/soothing-repairing-care/)
- [Wonderful Beauty：Oxy-Bright Serum 详情](https://wonderfulbeauty.com.my/product/oxy-bright-serum-30ml/)
- [DagangHalal：Merveilleux Hydro-Moist Serum](https://www.daganghalal.com/Product/merveilleux_hydro-moist_serum_30ml_49557)
- [Come Beli：Intensive Restoration Serum](https://ucomebeli.com/product/merveilleux-intensive-restoration-serum/)
- [Lazada：Vital Perfect UV SPF30](https://www.lazada.com.my/products/ready-stock-merveilleux-vital-perfect-uv-spf30-30ml-i2569083108.html)
- [Shopee：Merveilleux Trial Set A–F 组合资料](https://shopee.com.my/Merveilleux-Trial-Set-~-Repair-Hydrating-Brightening-Hydra-Congested-Pimple-Deep-Repair-Hydra-Deep-Repair-Congested-i.556096763.12334530985)
- [Merveilleux HQ / Bellesenze Beauty 的 Bio-Peptide 宣传资料镜像](https://www.beautynailhairsalons.com/MY/Unknown/135570533132852/Merveilleux-HQ---Bellesenze-Beauty)

## 可信度说明

- **高**：包装/品牌方原始资料与多个公开销售页一致。
- **中**：项目内部聊天资料已整理成资料卡，但缺包装背标或公开页面交叉验证。
- **待确认**：只有宣传图、套装卡或二级转发；规格、价格、完整成分或使用方法仍缺失。

在品牌方确认前，本清单适合作为研究底稿和资料追踪表，不应直接当作最终官网文案、医疗/功效承诺或正式价格表发布。
