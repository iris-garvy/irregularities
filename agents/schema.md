# Irregularities research records, version 1.0

Start at https://irregularities.org/data/index.json and read
https://irregularities.org/agents/guide.md for interpretation and coverage rules.
Files are UTF-8 JSON. Links are absolute HTTPS URLs; no JavaScript is required.

## Discovery

- `data/index.json` is the catalog. `dataset_version` identifies its contents.
  Entries marked `published` link to a topic's `data_url`; `in_progress` entries
  have no public evidence export. `sha256` and `bytes` describe the linked file.
- `data/<slug>/index.json` describes one phenomenon, its review snapshot, claims,
  chunked study indexes, related findings, reading list and known gaps.
- A claim's `data_url` supplies its definition, displayed wording, original
  result, source groups and their study references.
- Follow `study_indexes` for searchable descriptions of sources and their
  stated subjects, operations and measures. Follow a study's `data_url` for
  detailed findings and measurement rows. File names are opaque; follow links
  rather than constructing them from paper IDs.

Study-directory `version_assessments` preserve each claim's recorded test status,
including `tested_not_extracted`: testing is recorded but the needed measurements
are missing from the extracted rows. The shorter `versions` list includes only
the `tested` status and must not be used as an exhaustive test-coverage filter.

## Identity, snapshots and citations

`schema_version` describes this format. `snapshot.synthesis_tag` names the
underlying synthesis run; `snapshot.content_sha256` identifies the exported
topic content. Content may change without a new synthesis tag. Re-fetch the
root catalog to detect updates, and retain its `dataset_version` with an answer
when reproducibility matters. Hashes describe linked bytes and can be checked
before following additional references.

A claim version is local to a phenomenon. A measurement `row_id` is local to a
study in a phenomenon. Use all three identifiers when referring to measurements;
the same paper can occur in several topics with different extracted context.

`page_url` and `page_placements` point to human-readable pages or existing study
blocks. `source.url` identifies the original paper, post or repository. A source
can be included in the export without a dedicated block on the human page.
Use its data link and original source, with the row's `locator`, in that case.

## Evidence and scope

Study files preserve the merged extracted measurements and condition-specific
relationships. The subject, size, stage, operation, conditions, measure,
baseline, value, uncertainty, role, state and source locator are recorded as
stated, including unknown values. These fields are not a normalized checkpoint
registry. Check the actual subject and conditions rather than assuming that
two mentions of a model family describe the same experiment.

The `relationship` values are `supports`, `limits` and `challenges`.
`stored_label` retains the underlying `limits_scope` spelling for Limits.
Row references connect the
classification to its measurements; reasons, displayed paraphrases and
authors' conclusions have distinct attribution. Not every related measurement
is assigned to an existing claim; a version value of `none` preserves this fact.

Group counts are distinct sources within a claim/group, not counts of results
or votes. One source may occupy multiple groups. Original results are separate
from later sources. An original source selected for display does not by itself
establish that it tested that claim; inspect the original test flag and rows.

## Missing context and checks

Study coverage fields preserve read status, omitted results, untested parts,
missing information and extraction problems when present. The export includes
merged records used for published topics; it does not include every candidate
or every read that lacks a merged verdict. Topic coverage counts refer only to
that snapshot and do not measure completeness of the scientific literature.

`source_check` is separate from the stored record. Its status is `returned` or
`not_in_snapshot`; a returned check may cover only some rows or relationships.
Per-field flags and proposed corrections stay separate and do not silently
replace measurements or change group counts. Empty checks never mean approval.
Read disagreement reasons before reporting affected findings.

Some older returned label checks have no ID. All returned checks remain in the
study-level check arrays. A check is attached to an individual relationship only
when its ID has a compatible signature or its version, label and condition form
a unique exact match. `match_basis` describes the link; unmatched or ambiguous
checks remain explicitly available without a guessed assignment.

The guides and record format describe how to inspect the dataset. They are not
an automated assessment of how convincing a claim is.
