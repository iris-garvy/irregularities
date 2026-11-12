# The irregularities project: research guide

Research records for the irregularities project. These files help people and agents find the conditions under which reported deep-learning effects hold, inspect disagreements and return to the original sources.

- Catalog data: https://irregularities.org/data/index.json
- Plain-text reading guide: https://irregularities.org/agents/guide.md
- Data format: https://irregularities.org/agents/schema.md
- Human catalog: https://irregularities.org/phenomena/

## How to find evidence

Start with data/index.json. It lists every catalog topic and whether research records have been published. Follow a topic's data_url, then its claim data_url or the study_indexes. The study indexes describe the models, operations and measures as stated, and link to individual study files. Fetch the studies relevant to the question rather than loading the entire collection.

Each reference includes a SHA-256 hash and byte size. All data_url and page_url links are absolute. Re-fetch the root index for a new research session; its dataset_version identifies that export snapshot. A synthesis tag is the underlying review run, not a guarantee that the text has not changed since that date.

Check the exact claim definition, tested subject, training stage, operation, conditions, measure, baseline and uncertainty together. Model names and checkpoints are recorded as stated in the source; a shared family or parameter count does not establish the same checkpoint. Missing or ambiguous identity stays unknown. If discovery terms do not find a match, inspect plausible nearby records before concluding that this catalog contains no matching evidence.

## What the records mean

A phenomenon contains several specific claim versions. The page's heading and summary are reader-facing wording; the claim definition records the formulation used in reviewing studies. Their scope can differ. Findings are linked to claim versions, particular conditions and study-local measurement row IDs. Cite a row using its phenomenon, study and row ID together.

Supports: the results behave as the claim says, in the setting tested. Limits: observed partial effects or boundaries, including dependence on models, settings, methods, judges, layers or costs. Challenges: the effect is absent or reversed where the claim predicts it. Parts a study did not test are not Limits. A source can contribute to more than one group under different conditions.

Group counts are distinct sources within one claim and group. They overlap across groups and claims, and are not experiment counts, votes or confidence scores. Suggested status and the catalog's relationship classifications are judgments to inspect alongside the evidence; they do not decide what a researcher should believe.

The original-result summary is separate from later evidence. An original source's presence does not establish that it tested every claim. Inspect its linked measurement rows and the recorded original test flag. Related findings can be relevant without testing a claim as worded. A record classified as testing can also contain a theoretical argument rather than a new empirical reproduction.

Rows retain their role, such as a main result, control or comparator. An observed, partial, absent or reversed state describes that row in its recorded setting. Absent can include effects the source calls negligible or statistically non-significant; it does not prove a zero effect. Cannot determine, not tested, unavailable source text and no matching catalog record are different situations.

## Coverage and review

The export covers the merged study records used by each published topic, including records not selected for the compact web page. It is a literature-review dataset, not an exhaustive record of everything ever tested. Topics marked in progress have no public evidence export yet. Study read status, missing information, omitted results, untested parts and known gaps should qualify any answer.

A source check is separate from the extracted record and classification. Returned checks may cover only some rows or labels. Check corrections and disagreements are preserved separately; they are not silently applied to the published measurements or counts. A returned check is not whole-study approval. Not in snapshot means no returned check is included here; it does not tell you whether a check was requested or will arrive.

The authors' conclusion, extracted measurements, catalog classification, reader-facing paraphrase and source-check comments have different roles. Keep their attribution when reporting. Missing verdicts and partial extraction can limit coverage even when a reading run has finished. The source paper, post or repository remains the reference to verify when details matter.

## Reporting an answer

Report the specific claim, model or checkpoint as stated, intervention, task, metric and comparison. Separate supporting, limiting and challenging results by the conditions that produced them. Give measurements and uncertainty where recorded, and flag relevant source-check disagreements or missing context.

Link to the claim or study on the human page when a placement exists, and to the original source and its table, figure, section or other locator. Some additional records have no study block on the page; use their data_url and source.url instead of inventing an anchor. Explain which scope was searched. Say that the available catalog records do not establish an answer when that is what the evidence supports; do not turn no match into a claim that nobody has tested it.

## Example request

Read https://irregularities.org/llms.txt and use its research records to investigate whether [specific claim] has been tested on [exact model or checkpoint]. Report supporting, limiting and challenging results, their tested conditions, source citations and relevant coverage limits.
