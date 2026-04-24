import Button from '@/components/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormik } from 'formik';

export interface AddRegularMassDialogProps {
  community: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    type: 'parish_church' | 'chapel';
    address: string;
    coverId: string;
    coverUrl: string;
  };
}

export default function AddRegularMassDialog({community}: AddRegularMassDialogProps) {
  const formik = useFormik({
    initialValues: {
      recurrenceType: 'monthly',
      dayOfWeek: 0,
    },
    onSubmit: (values) => {
      console.log(values);
    }
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Adicionar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Adicionar Missa Regular</DialogTitle>
        </DialogHeader>
        <form className='p-5'>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                Comunidade
              </FieldLabel>
              <Select defaultValue={community.id} disabled>
                <SelectTrigger id="checkout-exp-month-ts6">
                  <SelectValue placeholder={community.name} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={community.id} disabled>
                      {community.name}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="recurrence-type">
                Tipo de Recorrência
              </FieldLabel>
              <RadioGroup 
                name="recurrenceType"
                defaultValue="monthly" 
                value={formik.values.recurrenceType} 
                className="w-fit"
                onValueChange={(newValue) => formik.setFieldValue('recurrenceType', newValue)}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="weekly" id="r1" />
                  <Label htmlFor="r1">Dia da semana</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="monthly" id="r2" />
                  <Label htmlFor="r2">Dia do mês</Label>
                </div>
              </RadioGroup>
            </Field>
            {formik.values.recurrenceType === 'weekly' && (
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                  Dia da Semana
                </FieldLabel>
                <FieldGroup className="grid grid-cols-3 gap-3">
                  <Field orientation="horizontal">
                    <Checkbox id="sunday" name="sunday" value={0} />
                    <Label htmlFor="sunday">Domingo</Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="monday" name="monday" value={1} />
                    <Label htmlFor="monday">Segunda-feira</Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="tuesday" name="tuesday" value={2} />
                    <Label htmlFor="tuesday">Terça-feira</Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="wednesday" name="wednesday" value={3} />
                    <Label htmlFor="wednesday">Quarta-feira</Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="thursday" name="thursday" value={4} />
                    <Label htmlFor="thursday">Quinta-feira</Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="friday" name="friday" value={5} />
                    <Label htmlFor="friday">Sexta-feira</Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="saturday" name="saturday" value={6} />
                    <Label htmlFor="saturday">Sexta-feira</Label>
                  </Field>
                </FieldGroup>
              </Field>
            )}
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit">Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}