/**
 * SourcingHomeStackNavigator - Stack Navigator para Home de Sourcing
 * 
 * Gerencia a navegação entre:
 * - Dashboard principal
 * - Análise de propostas
 * - Detalhes de RFQ
 */

import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SourcingHomeScreen } from '@/src/screens/sourcing/SourcingHomeScreen';
import { ProposalAnalysisScreen } from '@/src/screens/sourcing/ProposalAnalysisScreen';
import { NewRFQModal } from '@/src/components/sourcing/NewRFQModal';
import { useAuth } from '@/src/hooks/useAuth';
import rfqService from '@/src/services/rfqService';
import { RFQ } from '@/src/hooks/useRFQs';
import { Proposal } from '@/src/hooks/useProposals';

const Stack = createNativeStackNavigator();

/**
 * Stack Navigator para Home de Sourcing
 */
export function SourcingHomeStackNavigator() {
  const { user } = useAuth();
  const [showNewRFQModal, setShowNewRFQModal] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);

  const handleCreateRFQ = async (data: {
    title: string;
    category: 'hydraulic' | 'electrical' | 'equipment' | 'services';
    deadline: string;
    specifications: string;
    budget?: number;
  }) => {
    if (!user) throw new Error('Usuário não autenticado');

    await rfqService.createRFQ({
      ...data,
      createdBy: user.uid,
    });
  };

  const handleAdjudicateProposal = async (proposal: Proposal) => {
    if (!selectedRFQ) throw new Error('RFQ não selecionada');

    // Aqui você implementaria a lógica de adjudicação
    // Por exemplo, atualizar o status da proposta e fechar a RFQ
    console.log('Adjudicando proposta:', proposal.id);
  };

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="SourcingHome"
          options={{
            headerShown: false,
          }}
        >
          {() => (
            <SourcingHomeScreen
              onOpenRFQ={() => setShowNewRFQModal(true)}
              onSelectRFQ={(rfq) => {
                setSelectedRFQ(rfq);
                // Navegar para ProposalAnalysis
              }}
            />
          )}
        </Stack.Screen>

        {selectedRFQ && (
          <Stack.Screen
            name="ProposalAnalysis"
            options={{
              headerShown: false,
            }}
          >
            {() => (
              <ProposalAnalysisScreen
                rfq={selectedRFQ}
                onBack={() => {
                  setSelectedRFQ(null);
                }}
                onAdjudicate={handleAdjudicateProposal}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>

      {/* Modal para criar nova RFQ */}
      <NewRFQModal
        visible={showNewRFQModal}
        onClose={() => setShowNewRFQModal(false)}
        onSubmit={handleCreateRFQ}
      />
    </>
  );
}

export default SourcingHomeStackNavigator;
