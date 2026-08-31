-- Keep every course visible to each major whose curriculum explicitly uses it.
-- Idempotent: it only adds missing major keys and never removes existing ones.
WITH planned_memberships AS (
  SELECT
    e.course_id,
    ARRAY(
      SELECT DISTINCT major_key
      FROM unnest(
        COALESCE(c.majors, ARRAY[]::text[]) || ARRAY_AGG(e.major_key)
      ) AS values(major_key)
      WHERE major_key IS NOT NULL AND major_key <> ''
      ORDER BY major_key
    ) AS merged_majors
  FROM public.curriculum_plan_entries AS e
  JOIN public.courses AS c ON c.id = e.course_id
  WHERE e.course_id IS NOT NULL
    AND e.major_key IS NOT NULL
    AND e.major_key <> ''
  GROUP BY e.course_id, c.majors
)
UPDATE public.courses AS c
SET majors = planned_memberships.merged_majors
FROM planned_memberships
WHERE c.id = planned_memberships.course_id
  AND c.majors IS DISTINCT FROM planned_memberships.merged_majors;
