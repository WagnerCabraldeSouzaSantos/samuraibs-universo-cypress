import SignupPage from '../support/pages/signup'

describe('Cadastro', function () {


    context('Quando o usuário é novato', function () {

        const user = {

            name: 'Wagner Cabral',
            email: 'wcdss12@samuraibs.com',
            password: '123456'

        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('Deve cadastrar usuário', function () {

            SignupPage.go()

            cy.contains('a[href="/signup"]', 'Criar conta')
                .click()

            SignupPage.form(user)

            SignupPage.submit()

            SignupPage.Toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')

        })

    })

    context('Quando já existe o usuário', function () {

        const user = {

            name: 'Wagner Cabral',
            email: 'wcdss12@samuraibs.com',
            password: '123456',
            is_provider: true
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

        })

        it('Deve exibir email já cadastrado', function () {

            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })

            SignupPage.go()

            cy.contains('a[href="/signup"]', 'Criar conta')
                .click()

            SignupPage.form(user)

            SignupPage.submit()

            SignupPage.Toast.shouldHaveText('Email já cadastrado para outro usuário.')

        })
    })

    context('Quando o email for incorreto', function () {

        const user = {
            name: 'Elizabeth Olsen',
            email: 'liza.yahoo.com',
            password: '123456'
        }

        it('deve exibir mensagem de alerta', function () {
            SignupPage.go()
            SignupPage.form(user)
            SignupPage.submit()
            SignupPage.alertHaveText('Informe um email válido')
        })
    })

    context('Quando a senha é muito curta', function () {

        const passwords = ['1', '2a', '3ab', '4abc', '5abcd']

        beforeEach(function () {
            SignupPage.go()
        })

        passwords.forEach(function (p) {

            it('não deve cadastrar com a senha: ' + p, function () {

                const user = {
                    name: 'Jason Friday',
                    email: 'jason@gmail.com',
                    password: p
                }

                SignupPage.form(user)
                SignupPage.submit()

            })

        });

        afterEach(function () {
            SignupPage.alertHaveText('Pelo menos 6 caracteres')
        })

    })

    context('Quando não preencho nenhum dos campos', function(){

        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function(){
            SignupPage.go()
            SignupPage.submit()
        })
        
        alertMessages.forEach(function(alert){
            it('deve exibir ' + alert.toLowerCase(), function(){
                SignupPage.alertHaveText(alert)
            })
        })
    })

})
