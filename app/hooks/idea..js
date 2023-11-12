import * as anchor from '@project-serum/anchor';
import { useEffect, useMemo, useState } from 'react';
import { IDEA_PROGRAM_PUBKEY } from '../constants';
import ideaIDL from '../constants/idea.json';
import toast from 'react-hot-toast';
import { SystemProgram } from '@solana/web3.js';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { authorFilter } from '../utils';

export function useIdea() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  const [initialized, setInitialized] = useState(false);
  const [lastIdea, setLastIdea] = useState(0);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);
  const [input, setInput] = useState('');
  const [allIdeas, setAllIdeas] = useState([]);

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(ideaIDL, IDEA_PROGRAM_PUBKEY, provider);
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    const findProfileAccounts = async () => {
      if (program && publicKey && !transactionPending) {
        try {
          setLoading(true);
          const [profilePda, profileBump] = await findProgramAddressSync(
            [utf8.encode('USER_STATE'), publicKey.toBuffer()],
            program.programId
          );
          const profileAccount = await program.account.userProfile.fetch(
            profilePda
          );

          if (profileAccount) {
            setLastIdea(profileAccount.lastIdea);
            setInitialized(true);

            const ideaAccounts = await program.account.ideaAccount.all([
              authorFilter(publicKey.toString()),
            ]);
            setIdeas(ideaAccounts);
          } else {
            console.log('Not yet initialized');
            setInitialized(false);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };
    findProfileAccounts();
    getAllIdeas();
  }, [publicKey, program, transactionPending]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const getAllIdeas = async () => {
    try {
      setLoading(true);
      const ideas = await program.account.ideaAccount.all();
      setAllIdeas(ideas);
      console.log('GET ALL');
    } catch (error) {
      console.log(error);
      toast.error(error.toString());
      setAllIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  const initializeUser = async () => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        const [profilePda, profileBump] = findProgramAddressSync(
          [utf8.encode('USER_STATE'), publicKey.toBuffer()],
          program.programId
        );

        const tx = await program.methods
          .initializeUser()
          .accounts({
            userProfile: profilePda,
            authority: publicKey,
            SystemProgram: SystemProgram.programId,
          })
          .rpc();

        setInitialized(true);
        toast.success('Successfully Initialized');
      } catch (error) {
        console.log(error);
        toast.error(error.toString());
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const addIdea = async (e) => {
    e.preventDefault();
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        const [profilePda, profileBump] = findProgramAddressSync(
          [utf8.encode('USER_STATE'), publicKey.toBuffer()],
          program.programId
        );
        const [ideaPda, ideaBump] = findProgramAddressSync(
          [
            utf8.encode('IDEA_STATE'),
            publicKey.toBuffer(),
            Uint8Array.from([lastIdea]),
          ],
          program.programId
        );

        if (input) {
          await program.methods
            .addIdea(input)
            .accounts({
              userProfile: profilePda,
              ideaAccount: ideaPda,
              authority: publicKey,
              systemProgram: SystemProgram.programId,
            })
            .rpc();
          toast.success('Successfully added idea.');
        }
      } catch (error) {
        console.log(error);
        toast.error(error.toString());
      } finally {
        setTransactionPending(false);
        setInput('');
      }
    }
  };

  const removeIdea = async (ideaPda, ideaIdx) => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        setLoading(true);
        const [profilePda, profileBump] = findProgramAddressSync(
          [utf8.encode('USER_STATE'), publicKey.toBuffer()],
          program.programId
        );

        await program.methods
          .removeIdea(ideaIdx)
          .accounts({
            userProfile: profilePda,
            ideaAccount: ideaPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        toast.success('Successfully removed an idea!');
      } catch (error) {
        console.log(error);
        toast.error(error.toString());
      } finally {
        setLoading(false);
        setTransactionPending(false);
      }
    }
  };

  const ownIdeas = useMemo(() => ideas.filter((idea) => idea.account.marked), [
    ideas,
  ]);

  return {
    initialized,
    initializeUser,
    loading,
    transactionPending,
    ideas,
    removeIdea,
    addIdea,
    input,
    setInput,
    handleChange,
    allIdeas,
    getAllIdeas,
  };
}
