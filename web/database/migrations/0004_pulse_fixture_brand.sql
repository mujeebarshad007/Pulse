-- Correct only the original fictional seed wording. Preserve all tester edits.
UPDATE pulse.doctors
SET profile = jsonb_set(profile, '{clinic}', to_jsonb(replace(profile->>'clinic', 'Big Pulse', 'Pulse')))
WHERE fictional = true
  AND profile->>'clinic' ~ '^Big Pulse Test Clinic [1-5]$';

UPDATE pulse.doctors
SET profile = jsonb_set(profile, '{about}', to_jsonb(
  'Fictional Pakistani provider for testing Pulse. This is not a real clinician, verified registration, or healthcare service.'::text
))
WHERE fictional = true
  AND profile->>'about' = 'Fictional Pakistani provider for testing Big Pulse. This is not a real clinician, verified registration, or healthcare service.';
