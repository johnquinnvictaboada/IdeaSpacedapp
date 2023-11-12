use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub last_idea: u8,
    pub idea_count: u8
}

#[account]
#[derive(Default)]
pub struct IdeaAccount {
    pub authority: Pubkey,
    pub idx: u8,
    pub content: String
}