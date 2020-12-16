import { INavData } from "@coreui/angular";

export const navItemsPremium: INavData[] = [
  {
    name: "Visão geral",
    url: "/home",
    icon: "icon-home",
    /*
    badge: {
      variant: 'info',
      text: 'NEW'
    }*/
  },
  {
    title: true,
    name: "Menu",
  },
  {
    name: "Lançamentos",
    url: "/lancamentos",
    icon: "fa fa-line-chart",
    children: [
      {
        name: "Despesas",
        url: "/lancamentos/despesas",
        //icon: "fa fa-minus-square",
      },
      {
        name: "Receitas",
        url: "/lancamentos/receitas",
        //icon: "fa fa-plus-square",
      },
      {
        name: "Transferências",
        url: "/lancamentos/transferencias",
        //icon: "fa fa fa-exchange",
      },
      {
        name: "Encerramento de período",
        url: "/lancamentos/trava-periodo",
        //icon: "fa fa-calendar-check-o",
      },
    ],
  },
  {
    name: "Cadastro",
    url: "/cadastro",
    icon: "fa fa-folder",
    children: [
      {
        name: "Categorias",
        url: "/cadastro/categoria",
        //icon: "fa fa-bookmark",
      },
      {
        name: "Tags",
        url: "/cadastro/tag",
        //icon: "fa fa-tag",
      },
      {
        name: "F. de pagamento",
        url: "/cadastro/forma-pagamento",
        //icon: "fa fa-money",
      },
      {
        name: "Centros para rateio",
        url: "/cadastro/centro",
        //icon: "fa fa-male",
      },
      {
        name: "Contas",
        url: "/cadastro/conta",
        //icon: "fa fa-credit-card",
      },
    ],
  },
  {
    name: "Metas",
    url: "/meta",
    icon: "fa fa-check-square-o",
    children: [
      {
        name: "Controle de metas",
        url: "/meta/metas",
        //icon: "fa fa-list-ol",
      },
    ],
  },

  {
    name: "Usuário",
    url: "/usuario",
    icon: "fa fa-user",
    children: [
      {
        name: "Alterar meus dados",
        url: "/usuario/alterar-usuario",
        //icon: "fa fa-pencil",
      },
      {
        name: "Alterar minha senha",
        url: "/usuario/alterar-senha",
         //icon: "fa fa-lock",
      },
    ],
  },
];
