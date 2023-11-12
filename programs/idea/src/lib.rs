use anchor_lang::prelude::*;

pub mod constant;
pub mod error;
pub mod states;
use crate::{constant::*, error::*, states::*};

declare_id!("DobTKbrN2eXb52PQZRcAJuDDBaNFnh58xFnG1Z5iVNCX");

#[program]
pub mod idea_sharing {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.authority = ctx.accounts.authority.key();
        user_profile.last_idea = 0;
        user_profile.idea_count = 0;

        Ok(())
    }

    pub fn add_idea(ctx: Context<AddIdea>, _content: String) -> Result<()> {
        let idea_account = &mut ctx.accounts.idea_account;
        let user_profile = &mut ctx.accounts.user_profile;

        require!(!_content.is_empty(), IdeaError::IdeaNotEmpty);

        idea_account.authority = ctx.accounts.authority.key();
        idea_account.idx = user_profile.last_idea;
        idea_account.content = _content;

        user_profile.last_idea = user_profile.last_idea.checked_add(1).unwrap();
        user_profile.idea_count = user_profile.idea_count.checked_add(1).unwrap();

        Ok(())
    }

    pub fn remove_idea(ctx: Context<RemoveIdea>, idea_idx: u8) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.idea_count = user_profile.idea_count.checked_sub(1).unwrap();

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction()]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<UserProfile>(),
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct AddIdea<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        init,
        seeds = [IDEA_TAG, authority.key().as_ref(), &[user_profile.last_idea as u8].as_ref()],
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<IdeaAccount>(),
    )]
    pub idea_account: Box<Account<'info, IdeaAccount>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(idea_idx: u8)]
pub struct RemoveIdea<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        mut,
        close = authority,
        seeds = [IDEA_TAG, authority.key().as_ref(), &[idea_idx].as_ref()],
        bump,
        has_one = authority,
    )]
    pub idea_account: Box<Account<'info, IdeaAccount>>,

    pub system_program: Program<'info, System>,
}
