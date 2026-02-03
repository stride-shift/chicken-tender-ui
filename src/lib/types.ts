// Enums matching database constraints
export type Recommendation = 'excellent_fit' | 'good_fit' | 'worth_reviewing' | 'not_recommended'
export type Importance = 'high' | 'medium' | 'low'
export type TenderStatus = 'active' | 'awarded' | 'closed' | 'cancelled'
export type ChangeType = 'metadata' | 'document'

// Dashboard stats from get_dashboard_stats()
export interface DashboardStats {
  total_active: number
  total_relevant: number
  total_not_relevant: number
  excellent_count: number
  good_count: number
  worth_reviewing_count: number
  briefings_next_7_days: number
  closing_next_7_days: number
  high_importance_changes_24h: number
}

// Tender list item from get_tenders_paginated()
export interface TenderListItem {
  tender_pk: number
  tender_no: string
  description: string
  generated_title: string | null
  current_status: TenderStatus
  date_published: string
  closing_date: string
  days_until_close: number
  category_id: number | null
  category_name: string | null
  province_id: number | null
  province_name: string | null
  department_id: number | null
  department_name: string | null
  briefing_datetime: string | null
  is_briefing_compulsory: boolean
  allows_esubmission: boolean
  contact_person: string | null
  contact_email: string | null
  evaluation_pk: number
  recommendation: Recommendation
  score_percentage: number
  knockout_passed: boolean
  llm_notes: string | null
  quality_score: number | null
  is_relevant: boolean
  total_count: number
}

// Tender detail from get_tender_detail()
export interface TenderDetail {
  tender_pk: number
  source_tender_id: string
  tender_no: string
  description: string
  current_status: TenderStatus
  date_published: string
  closing_date: string
  days_until_close: number
  category_id: number | null
  category_name: string | null
  tender_type: string | null
  organ_of_state: string | null
  contact_person: string | null
  contact_email: string | null
  contact_phone: string | null
  province_id: number | null
  province_name: string | null
  department_id: number | null
  department_name: string | null
  town: string | null
  delivery_address: string | null
  briefing_datetime: string | null
  briefing_venue: string | null
  is_briefing_compulsory: boolean
  has_briefing_session: boolean
  allows_esubmission: boolean
  structured_data: Record<string, unknown> | null
  // Synthesis
  synthesis_pk: number | null
  generated_title: string | null
  final_report_text: string | null
  quality_score: number | null
  quality_explanation: string | null
  // Evaluation
  evaluation_pk: number | null
  rubric_pk: number | null
  recommendation: Recommendation | null
  score_percentage: number | null
  score_earned: number | null
  score_possible: number | null
  knockout_passed: boolean | null
  knockout_results: Record<string, KnockoutResultValue> | null
  criteria_results: Record<string, CriteriaResultValue> | null
  llm_notes: string | null
  // Related data
  documents: TenderDocument[]
  recent_changes: TenderChange[]
}

// Knockout result value (keyed by K1, K2, etc. in the results object)
export interface KnockoutResultValue {
  answer: 'YES' | 'NO' | 'UNSURE'
  reason: string
}

// Criteria result value (keyed by C1, C2, etc. in the results object)
export interface CriteriaResultValue {
  answer: 'YES' | 'NO' | 'UNSURE' | 'PARTIAL'
  evidence: string
}

// Document structure
export interface TenderDocument {
  document_pk: number
  file_name: string
  file_extension: string | null
  file_size: number | null
  document_type: string | null
  download_url: string | null
  processing_status: 'available' | 'processing' | 'unavailable'
  date_created: string | null
  date_modified: string | null
}

// Document change structure
export interface DocumentChange {
  file_name: string
  source_document_id?: string
}

// Change structure
export interface TenderChange {
  change_pk: number
  observed_at: string
  change_type: ChangeType
  highest_importance: Importance
  changes_json: {
    changes: FieldChange[]
    documents: {
      added: (string | DocumentChange)[]
      removed: (string | DocumentChange)[]
      modified: (string | DocumentChange)[]
    }
    summary: {
      total_changes: number
      high_count: number
      medium_count: number
      low_count: number
    }
  }
}

export interface FieldChange {
  field: string
  category: string
  previous: string | null
  current: string | null
  importance: Importance
}

// Filter options from get_filter_options()
export interface FilterOptions {
  provinces: FilterOption[]
  departments: FilterOption[]
  categories: FilterOption[]
}

export interface FilterOption {
  id: number
  name: string
  count: number
}

// Activity feed item from get_activity_feed()
export interface ActivityItem {
  change_pk: number
  tender_pk: number
  tender_no: string
  description_preview: string
  change_type: ChangeType
  highest_importance: Importance
  changes_json: TenderChange['changes_json']
  observed_at: string
  recommendation: Recommendation
  score_percentage: number
}

// Client rubric from get_client_rubric()
export interface ClientRubric {
  rubric_pk: number
  client_pk: number
  client_name: string
  version: number
  is_active: boolean
  description: string | null
  knockouts: RubricKnockout[]
  criteria: RubricCriterion[]
  scoring_config: ScoringConfig
  created_at: string
  updated_at: string
}

export interface RubricKnockout {
  id: string
  question: string
  fail_message: string
}

export interface RubricCriterion {
  id: string
  question: string
  weight: number
  category: string
  unsure_handling?: 'neutral' | 'fail' | 'partial'
}

export interface ThresholdRange {
  min: number
  max: number
  label: string
}

export interface ScoringConfig {
  max_points_per_criterion?: number
  unsure_handling?: 'neutral' | 'fail' | 'partial'
  thresholds: {
    excellent_fit: ThresholdRange
    good_fit: ThresholdRange
    worth_reviewing: ThresholdRange
    not_recommended?: ThresholdRange
  }
}
